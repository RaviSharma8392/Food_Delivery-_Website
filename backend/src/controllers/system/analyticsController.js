// controllers/analyticsController.js
import Order from '../../models/Order.js';
import Restaurant from '../../models/Restaurant.js';
import User from '../../models/User.js';
export const getPerformanceAnalytics = async (req, res) => {
  try {
    const { timeRange = 'week', startDate, endDate } = req.query;
    const now = new Date();
    let dateFilter = {};

    // Handle date filtering
    if (startDate && endDate) {
      // Custom date range takes priority
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      // Predefined ranges
      switch (timeRange) {
        case 'day':
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          dateFilter = {
            createdAt: {
              $gte: startOfDay,
              $lte: new Date()
            }
          };
          break;
        
        case 'week':
          const startOfWeek = new Date();
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          dateFilter = {
            createdAt: {
              $gte: startOfWeek,
              $lte: new Date()
            }
          };
          break;
        
        case 'month':
          dateFilter = {
            createdAt: {
              $gte: new Date(now.getFullYear(), now.getMonth(), 1),
              $lte: new Date()
            }
          };
          break;
        
        default:
          // Default to week if invalid range provided
          const defaultStart = new Date();
          defaultStart.setDate(defaultStart.getDate() - defaultStart.getDay());
          defaultStart.setHours(0, 0, 0, 0);
          dateFilter = {
            createdAt: {
              $gte: defaultStart,
              $lte: new Date()
            }
          };
      }
    }

    const [
      timeline,
      orderStatus,
      deliveryMetrics,
      topRestaurants
    ] = await Promise.all([
      // Daily metrics timeline
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            orderCount: { $sum: 1 },
            completedOrders: {
              $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] }
            }
          }
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            date: "$_id",
            orderCount: 1,
            completedOrders: 1,
            _id: 0
          }
        }
      ]),

      // Order status distribution
      Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $project: { status: "$_id", count: 1, _id: 0 } }
      ]),

      // Delivery performance metrics
      Order.aggregate([
        {
          $match: {
            ...dateFilter,
            status: "delivered",
            deliveryTime: { $exists: true, $gt: 0 }
          }
        },
        {
          $group: {
            _id: null,
            avgDeliveryTime: { $avg: "$deliveryTime" },
            fastestDelivery: { $min: "$deliveryTime" },
            slowestDelivery: { $max: "$deliveryTime" }
          }
        }
      ]),

      // Top performing restaurants
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$restaurantId",
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { orderCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "restaurants",
            localField: "_id",
            foreignField: "_id",
            as: "restaurant"
          }
        },
        { $unwind: "$restaurant" },
        {
          $project: {
            restaurantName: "$restaurant.name",
            orderCount: 1,
            _id: 0
          }
        }
      ])
    ]);

    res.json({
      timeline,
      orderStatus,
      deliveryMetrics: deliveryMetrics[0] || {
        avgDeliveryTime: 0,
        fastestDelivery: 0,
        slowestDelivery: 0
      },
      topRestaurants
    });
  } catch (error) {
    console.error('Error fetching performance analytics:', error);
    res.status(500).json({ 
      message: 'Failed to load performance analytics',
      error: error.message 
    });
  }
};

// Get sales analytics
export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    if (period === 'day') {
      dateFilter = {
        $gte: new Date(now.setHours(0, 0, 0, 0)),
        $lte: new Date(now.setHours(23, 59, 59, 999))
      };
    } else if (period === 'week') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      dateFilter = {
        $gte: new Date(startOfWeek.setHours(0, 0, 0, 0)),
        $lte: new Date()
      };
    } else if (period === 'month') {
      dateFilter = {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
        $lte: new Date()
      };
    }

    // Total sales
    const totalSales = await Order.aggregate([
      { $match: { status: 'delivered', createdAt: dateFilter } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Sales by restaurant
    const salesByRestaurant = await Order.aggregate([
      { $match: { status: 'delivered', createdAt: dateFilter } },
      { 
        $group: { 
          _id: '$restaurantId', 
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        } 
      },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);

    // Populate restaurant names
    const restaurantIds = salesByRestaurant.map(s => s._id);
    const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } });
    
    const salesWithNames = salesByRestaurant.map(sale => {
      const restaurant = restaurants.find(r => r._id.equals(sale._id));
      return {
        ...sale,
        restaurantName: restaurant?.name || 'Unknown'
      };
    });

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $match: { createdAt: dateFilter } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      totalSales: totalSales[0]?.total || 0,
      topRestaurants: salesWithNames,
      orderStatus: ordersByStatus
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getSalesReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const report = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: today },
          status: 'delivered'
        } 
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          cashSales: {
            $sum: { $cond: [{ $eq: ['$method', 'cash'] }, '$totalAmount', 0] }
          },
          onlineSales: {
            $sum: { $cond: [{ $eq: ['$method', 'online'] }, '$totalAmount', 0] }
          },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          cashSales: 1,
          onlineSales: 1,
          orderCount: 1,
          avgOrderValue: 1,
          cashPercentage: {
            $cond: [
              { $eq: ['$totalSales', 0] },
              0,
              { $multiply: [{ $divide: ['$cashSales', '$totalSales'] }, 100] }
            ]
          },
          onlinePercentage: {
            $cond: [
              { $eq: ['$totalSales', 0] },
              0,
              { $multiply: [{ $divide: ['$onlineSales', '$totalSales'] }, 100] }
            ]
          }
        }
      }
    ]);

    res.json(report[0] || {
      totalSales: 0,
      cashSales: 0,
      onlineSales: 0,
      orderCount: 0,
      avgOrderValue: 0,
      cashPercentage: 0,
      onlinePercentage: 0
    });
  } catch (error) {
    console.error('Error fetching today sales:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWeeklySales = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const report = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfWeek },
          status: 'delivered'
        } 
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          day: { $first: { $dayOfWeek: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { day: 1 } },
      {
        $project: {
          _id: 0,
          day: 1,
          dayName: {
            $switch: {
              branches: [
                { case: { $eq: ['$day', 1] }, then: 'Sunday' },
                { case: { $eq: ['$day', 2] }, then: 'Monday' },
                { case: { $eq: ['$day', 3] }, then: 'Tuesday' },
                { case: { $eq: ['$day', 4] }, then: 'Wednesday' },
                { case: { $eq: ['$day', 5] }, then: 'Thursday' },
                { case: { $eq: ['$day', 6] }, then: 'Friday' },
                { case: { $eq: ['$day', 7] }, then: 'Saturday' }
              ]
            }
          },
          totalSales: 1,
          orderCount: 1
        }
      }
    ]);

    res.json(report);
  } catch (error) {
    console.error('Error fetching weekly sales:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMonthlySales = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const report = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfMonth },
          status: 'delivered',
          method: 'cash'
        } 
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          orderCount: 1,
          avgOrderValue: 1
        }
      }
    ]);

    res.json(report[0] || {
      totalSales: 0,
      orderCount: 0,
      avgOrderValue: 0
    });
  } catch (error) {
    console.error('Error fetching monthly cash sales:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMonthlySalesOnline = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const report = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfMonth },
          status: 'delivered',
          method: 'online'
        } 
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          orderCount: 1,
          avgOrderValue: 1
        }
      }
    ]);

    res.json(report[0] || {
      totalSales: 0,
      orderCount: 0,
      avgOrderValue: 0
    });
  } catch (error) {
    console.error('Error fetching monthly online sales:', error);
    res.status(500).json({ message: 'Server error' });
  }
};