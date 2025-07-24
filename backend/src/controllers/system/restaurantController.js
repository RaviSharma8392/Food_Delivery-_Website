import mongoose from 'mongoose';
import Restaurant from '../../models/Restaurant.js';
import User from '../../models/User.js';
import Order from '../../models/Order.js'; // ensure you have this
import FoodItem from '../../models/FoodItem.js'; // ensure you have this

// ─────────────────────────────────────────────
// 📊 ANALYTICS
// ─────────────────────────────────────────────
// controllers/userController.js
export const getOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: "Restaurent" }).select("_id name email");
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch owners" });
  }
};

export const getRestaurantPerformance = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query; // daily, weekly, monthly, yearly
    const { restaurantId } = req.params;

    // Calculate date ranges based on period
    const now = new Date();
    let startDate, endDate = now;

    switch (period) {
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Base match filter
    const matchFilter = {
      createdAt: { $gte: startDate, $lte: endDate },
      status: 'delivered' // Only count completed orders
    };

    if (restaurantId) {
      matchFilter.restaurantId = new mongoose.Types.ObjectId(restaurantId);
    }

    const performanceData = await Order.aggregate([
      // Filter orders by date range and status
      { $match: matchFilter },
      
      // Group by restaurant and calculate metrics
      {
        $group: {
          _id: "$restaurantId",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" },
          deliveryTimes: { $push: "$deliveryTime" } // For calculating avg later
        }
      },
      
      // Join with restaurants collection
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "_id",
          as: "restaurant"
        }
      },
      
      // Unwind the restaurant array
      { $unwind: "$restaurant" },
      
      // Calculate additional metrics
      {
        $addFields: {
          avgDeliveryTime: { $avg: "$deliveryTimes" },
          name: "$restaurant.name",
          image: "$restaurant.image",
          cuisine: "$restaurant.cuisine"
        }
      },
      
      // Remove unnecessary fields
      {
        $project: {
          restaurant: 0,
          deliveryTimes: 0
        }
      },
      
      // Sort by total revenue (descending)
      { $sort: { totalRevenue: -1 } }
    ]);

    // If specific restaurant requested but not found
    if (restaurantId && performanceData.length === 0) {
      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant) {
        performanceData.push({
          _id: restaurant._id,
          name: restaurant.name,
          image: restaurant.image,
          cuisine: restaurant.cuisine,
          totalOrders: 0,
          totalRevenue: 0,
          avgOrderValue: 0,
          avgDeliveryTime: 0
        });
      }
    }

    res.json({
      period,
      startDate,
      endDate,
      data: performanceData
    });

  } catch (error) {
    console.error("Error in getRestaurantPerformance:", error);
    res.status(500).json({ 
      message: "Error fetching performance data",
      error: error.message 
    });
  }
};

export const getRestaurantAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { period = 'week' } = req.query;

    const now = new Date();
    let dateFilter = {};

    if (period === 'day') {
      dateFilter = {
        $gte: new Date(now.setHours(0, 0, 0, 0)),
        $lte: new Date(now.setHours(23, 59, 59, 999))
      };
    } else if (period === 'week') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      dateFilter = { $gte: new Date(startOfWeek.setHours(0, 0, 0, 0)), $lte: new Date() };
    } else if (period === 'month') {
      dateFilter = { $gte: new Date(now.getFullYear(), now.getMonth(), 1), $lte: new Date() };
    }

    const [restaurant, overview, timeline, popularItems, customerTypes] = await Promise.all([
      Restaurant.findById(id),

      Order.aggregate([
        {
          $match: {
            restaurantId: mongoose.Types.ObjectId(id),
            createdAt: dateFilter
          }
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            completedOrders: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
            cancelledOrders: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
            totalRevenue: { $sum: "$totalAmount" },
            avgOrderValue: { $avg: "$totalAmount" },
            platformCommission: { $sum: { $multiply: ["$totalAmount", 0.2] } }
          }
        }
      ]),

      Order.aggregate([
        {
          $match: {
            restaurantId: mongoose.Types.ObjectId(id),
            createdAt: dateFilter
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            orderCount: { $sum: 1 },
            revenue: { $sum: "$totalAmount" }
          }
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", orderCount: 1, revenue: 1, _id: 0 } }
      ]),

      Order.aggregate([
        {
          $match: {
            restaurantId: mongoose.Types.ObjectId(id),
            createdAt: dateFilter
          }
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.itemId",
            count: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "food_items",
            localField: "_id",
            foreignField: "_id",
            as: "itemDetails"
          }
        },
        { $unwind: "$itemDetails" },
        {
          $project: {
            itemId: "$_id",
            name: "$itemDetails.name",
            count: 1,
            revenue: 1,
            image: "$itemDetails.image",
            _id: 0
          }
        }
      ]),

      Order.aggregate([
        {
          $match: {
            restaurantId: mongoose.Types.ObjectId(id),
            createdAt: dateFilter
          }
        },
        {
          $group: {
            _id: "$userId",
            totalSpent: { $sum: "$totalAmount" }
          }
        },
        {
          $bucket: {
            groupBy: "$totalSpent",
            boundaries: [0, 500, 1000, 2000, 5000, Infinity],
            default: "Other",
            output: {
              count: { $sum: 1 },
              totalRevenue: { $sum: "$totalSpent" }
            }
          }
        }
      ])
    ]);

    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    res.json({
      restaurant,
      overview: overview[0] || {
        totalOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
        platformCommission: 0
      },
      timeline,
      popularItems,
      customerTypes
    });
  } catch (error) {
    console.error('Error fetching restaurant analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate('owner', 'name email')
      .sort({ promoted: -1, createdAt: -1 });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRestaurantDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id)
      .populate('owner', 'name email phone')
      .populate('menuItems', 'name price category');

    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [orderStats, popularItems, earnings, timelineData] = await Promise.all([
      Order.aggregate([
        { $match: { restaurantId: mongoose.Types.ObjectId(id) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { status: '$_id', count: 1, _id: 0 } }
      ]),

      // Popular items
      Order.aggregate([
        { $match: { restaurantId: mongoose.Types.ObjectId(id) } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.itemId',
            count: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'food_items',
            localField: '_id',
            foreignField: '_id',
            as: 'itemDetails'
          }
        },
        { $unwind: '$itemDetails' },
        {
          $project: {
            name: '$itemDetails.name',
            count: 1,
            totalRevenue: 1,
            image: '$itemDetails.image'
          }
        }
      ]),

      Order.aggregate([
        { $match: { restaurantId: mongoose.Types.ObjectId(id), status: 'delivered' } },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: '$totalAmount' },
            platformCommission: { $sum: { $multiply: ['$totalAmount', 0.2] } },
            todayEarnings: {
              $sum: { $cond: [{ $gte: ['$createdAt', today] }, '$totalAmount', 0] }
            },
            weeklyEarnings: {
              $sum: { $cond: [{ $gte: ['$createdAt', startOfWeek] }, '$totalAmount', 0] }
            },
            monthlyEarnings: {
              $sum: { $cond: [{ $gte: ['$createdAt', startOfMonth] }, '$totalAmount', 0] }
            }
          }
        }
      ]),

      Order.aggregate([
        { $match: { restaurantId: mongoose.Types.ObjectId(id), status: 'delivered' } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" }
          }
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", count: 1, revenue: 1, _id: 0 } }
      ])
    ]);

    res.json({
      restaurant,
      stats: {
        orders: orderStats,
        popularItems,
        earnings: earnings[0] || {},
        timeline: timelineData
      }
    });
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const { owner, ...data } = req.body;

    const ownerUser = await User.findById(owner);
    if (!ownerUser) {
      return res.status(400).json({ message: 'Owner user not found' });
    }

    const restaurant = new Restaurant({ ...data, owner });
    await restaurant.save();

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting restaurant', error: err });
  }
};

export const toggleRestaurantStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    restaurant.active = !restaurant.active;
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRestaurantStats = async (req, res) => {
  try {
    const active = await Restaurant.countDocuments({ active: true });
    const inactive = await Restaurant.countDocuments({ active: false });
    res.json({ active, inactive, total: active + inactive });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
