import Order from '../../models/Order.js';
import Restaurant from '../../models/Restaurant.js';
import DeliveryPartner from '../../models/DeliveryPartner.js';
import User from '../../models/User.js';

// ORDER CONTROLLERS
export const getPlatformEarnings = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
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
    } else if (period === 'year') {
      dateFilter = {
        $gte: new Date(now.getFullYear(), 0, 1),
        $lte: new Date()
      };
    }

    const earnings = await Order.aggregate([
      { 
        $match: { 
          status: 'delivered',
          createdAt: dateFilter
        } 
      },
      { 
        $group: { 
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          platformCommission: { $sum: { $multiply: ['$totalAmount', 0.2] } },
          deliveryFees: { $sum: '$deliveryFee' },
          cashOrders: {
            $sum: {
              $cond: [{ $eq: ['$method', 'cash'] }, '$totalAmount', 0]
            }
          },
          onlineOrders: {
            $sum: {
              $cond: [{ $eq: ['$method', 'online'] }, '$totalAmount', 0]
            }
          },
          orderCount: { $sum: 1 }
        } 
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          platformCommission: 1,
          deliveryFees: 1,
          cashOrders: 1,
          onlineOrders: 1,
          orderCount: 1,
          totalEarnings: {
            $add: ['$platformCommission', '$deliveryFees']
          }
        }
      }
    ]);

    res.json(earnings[0] || {
      totalRevenue: 0,
      platformCommission: 0,
      deliveryFees: 0,
      cashOrders: 0,
      onlineOrders: 0,
      orderCount: 0,
      totalEarnings: 0
    });
  } catch (error) {
    console.error('Error fetching platform earnings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getSystemStats = async (req, res) => {
  try {
    const [
      totalRestaurants,
      activeRestaurants,
      totalDeliveryPartners,
      activeDeliveryPartners,
      totalOrders,
      pendingOrders,
      preparingOrders,
      outForDeliveryOrders,
      completedOrders,
      cancelledOrders,
      totalCustomers,
      newCustomersThisMonth,
      platformEarnings
    ] = await Promise.all([
      Restaurant.countDocuments(),
      Restaurant.countDocuments({ active: true }),
      DeliveryPartner.countDocuments(),
      DeliveryPartner.countDocuments({ active: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'preparing' }),
      Order.countDocuments({ status: 'out_for_delivery' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ 
        role: 'customer',
        createdAt: { 
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
        }
      }),
      Order.aggregate([
        { 
          $match: { status: 'delivered' } 
        },
        { 
          $group: { 
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            platformEarnings: { $sum: { $multiply: ['$totalAmount', 0.2] } }, // 20% commission
            deliveryFeeEarnings: { $sum: '$deliveryFee' }
          } 
        }
      ])
    ]);

    res.json({
      restaurants: {
        total: totalRestaurants,
        active: activeRestaurants,
        inactive: totalRestaurants - activeRestaurants
      },
      deliveryPartners: {
        total: totalDeliveryPartners,
        active: activeDeliveryPartners,
        inactive: totalDeliveryPartners - activeDeliveryPartners
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        preparing: preparingOrders,
        outForDelivery: outForDeliveryOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        completionRate: totalOrders > 0 
          ? Math.round((completedOrders / totalOrders) * 100) 
          : 0
      },
      customers: {
        total: totalCustomers,
        newThisMonth: newCustomersThisMonth
      },
      earnings: platformEarnings[0] || {
        totalRevenue: 0,
        platformEarnings: 0,
        deliveryFeeEarnings: 0
      }
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const { status, restaurant, dateRange, deliveryStatus } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (restaurant) filters.restaurantId = restaurant;
    if (deliveryStatus) {
      if (deliveryStatus === 'assigned') {
        filters.deliveryPartner = { $exists: true };
      } else if (deliveryStatus === 'unassigned') {
        filters.deliveryPartner = { $exists: false };
      }
    }
    
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(',');
      filters.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(filters)
      .populate('userId', 'name email phone')
      .populate('restaurantId', 'name logo')
      .populate('items.itemId', 'name price')
      .populate('deliveryPartner', 'name phone vehicle')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get all users with their orders (for admin dashboard)(managing order page)
export const getAllUsersWithOrders = async (req, res) => {
  try {
    // Get all users
    const users = await User.find({}).sort({ createdAt: -1 });
    
    // Get orders for each user
    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ userId: user._id })
          .populate('items.itemId', 'name price')
          .populate('restaurantId', 'name');
        
        return {
          ...user.toObject(),
          orders,
          totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
          orderCount: orders.length
        };
      })
    );
    
    res.status(200).json(usersWithOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users data', error: error.message });
  }
};





// DELIVERY PARTNER CONTROLLERS


export const getAvailableDeliveryPartners = async (req, res) => {
  try {
    // Find partners who are active and not currently assigned to an active delivery
    const partners = await DeliveryPartner.aggregate([
      {
        $match: {
          active: true
        }
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'currentOrder',
          foreignField: '_id',
          as: 'currentOrderDetails'
        }
      },
      {
        $addFields: {
          isAvailable: {
            $or: [
              { $eq: [{ $size: '$currentOrderDetails' }, 0] },
              {
                $ne: [
                  { $arrayElemAt: ['$currentOrderDetails.status', 0] },
                  'out_for_delivery'
                ]
              }
            ]
          }
        }
      },
      {
        $match: {
          isAvailable: true
        }
      },
      {
        $sort: {
          rating: -1,
          totalDeliveries: 1
        }
      }
    ]);

    res.json(partners);
  } catch (error) {
    console.error('Error fetching available delivery partners:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

