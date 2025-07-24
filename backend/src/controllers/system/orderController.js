// controllers/orderController.js
import Order from '../../models/Order.js';
import Restaurant from '../../models/Restaurant.js';
import User from '../../models/User.js';

export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('restaurantId', 'name address')
      .populate('items.itemId', 'name price')
      .populate('deliveryPartner', 'name phone vehicle');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    // Fetch recent orders with key populations
    const rawOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("restaurantId", "name logo")
      .populate("deliveryPartner", "name phone")
      .populate("items.itemId") // full food item details
      .populate("userId", "name email phone"); // only when userId exists

    // Process each order to ensure user info is available even if userId is null
    const orders = rawOrders.map((order) => {
      const user = order.userId
        ? {
            _id: order.userId._id,
            name: order.userId.name,
            email: order.userId.email,
            phone: order.userId.phone,
          }
        : {
            name: order.name,
            email: order.email,
            phone: order.phone,
          };

      return {
        _id: order._id,
        user, // unified user object
        address: order.address,
        method: order.method,
        status: order.status,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        restaurant: order.restaurantId,
        deliveryPartner: order.deliveryPartner || null,
        items: order.items.map((i) => ({
          item: i.itemId,
          quantity: i.quantity,
          portion: i.portion,
        })),
      };
    });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get all orders with filters

export const getAllOrders = async (req, res) => {
  try {
    const { status, restaurant, dateRange, deliveryStatus } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (restaurant) filters.restaurantId = restaurant;
    if (deliveryStatus) filters.deliveryStatus = deliveryStatus;
    
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

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const [total, pending, completed] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' })
    ]);

    res.json({ total, pending, completed });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // TODO: Send notification to user about status change
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign delivery partner to order
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { deliveryPartner } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        deliveryPartner,
        status: 'out_for_delivery',
        assignedAt: new Date()
      },
      { new: true }
    )
    .populate('userId', 'name phone')
    .populate('restaurantId', 'name address')
    .populate('deliveryPartner', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // TODO: Send notification to delivery partner
    res.json(order);
  } catch (error) {
    console.error('Error assigning delivery partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
};