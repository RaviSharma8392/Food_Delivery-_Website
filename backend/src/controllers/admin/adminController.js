import Restaurant from "../../models/Restaurant.js";
import Order from "../../models/Order.js";
import User from "../../models/User.js";
import mongoose from "mongoose";

// Get all restaurants with stats
export const getAllRestaurantsWithStats = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    
    const restaurantsWithStats = await Promise.all(
      restaurants.map(async (restaurant) => {
        const orders = await Order.find({ restaurantId: restaurant._id });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        
        return {
          ...restaurant._doc,
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders,
        };
      })
    );
    
    res.json(restaurantsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get restaurant analytics
export const getRestaurantAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    
    // Orders data
    const orders = await Order.find({ restaurantId: id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    // Revenue calculation
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Monthly revenue aggregation
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          restaurantId: new mongoose.Types.ObjectId(id),
          status: 'delivered',
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    
    // Status counts
    const statusCounts = await Order.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    res.json({
      restaurant,
      stats: {
        totalOrders: orders.length,
        totalRevenue,
        monthlyRevenue,
        statusCounts,
      },
      recentOrders: orders.slice(0, 10),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new restaurant
export const createRestaurant = async (req, res) => {
  try {
    const { adminId, ...restaurantData } = req.body;
    
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'restaurant_admin') {
      return res.status(400).json({ message: 'Invalid admin ID' });
    }
    
    const restaurant = new Restaurant({
      ...restaurantData,
      adminId,
    });
    
    const savedRestaurant = await restaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update restaurant
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Toggle restaurant status
export const toggleRestaurantStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    
    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();
    
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};