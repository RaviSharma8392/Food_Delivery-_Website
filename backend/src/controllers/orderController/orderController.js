import Order from "../../models/Order.js";

// Create new order
export const createOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      userId: req.user._id
    });
    
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('restaurantId', 'name imageUrl')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get restaurant orders
export const getRestaurantOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { restaurantId: req.params.restaurantId };
    
    if (status) filter.status = status;
    
    const orders = await Order.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    );
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};