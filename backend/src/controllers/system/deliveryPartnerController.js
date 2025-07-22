// controllers/deliveryPartnerController.js
import DeliveryPartner from '../../models/DeliveryPartner.js';
import Order from '../../models/Order.js';

// Get all delivery partners
export const getAllDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find()
      .sort({ active: -1, createdAt: -1 });

    res.json(partners);
  } catch (error) {
    console.error('Error fetching delivery partners:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get delivery partner statistics
export const getDeliveryPartnerStats = async (req, res) => {
  try {
    const active = await DeliveryPartner.countDocuments({ active: true });
    const inactive = await DeliveryPartner.countDocuments({ active: false });
    const onDelivery = await Order.countDocuments({ 
      status: 'out_for_delivery',
      deliveryPartner: { $exists: true }
    });
    
    res.json({ active, inactive, onDelivery, total: active + inactive });
  } catch (error) {
    console.error('Error fetching delivery partner stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new delivery partner
export const createDeliveryPartner = async (req, res) => {
  try {
    // Destructure only the fields you want to allow
    const {
      name,
      phone,
      email,
      vehicle,
      vehicleNumber,
      rating,
      totalDeliveries,
      active
    } = req.body;

    // Create the partner document without location
    const partner = new DeliveryPartner({
      name,
      phone,
      email,
      vehicle,
      vehicleNumber,
      rating,
      totalDeliveries,
      active
    });

    await partner.save();
    res.status(201).json(partner);
  } catch (error) {
    console.error('Error creating delivery partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update delivery partner
export const updateDeliveryPartner = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    res.json(partner);
  } catch (error) {
    console.error('Error updating delivery partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle delivery partner status
export const toggleDeliveryPartnerStatus = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    partner.active = !partner.active;
    await partner.save();

    // If deactivating, unassign from any current deliveries
    if (!partner.active) {
      await Order.updateMany(
        { deliveryPartner: partner._id, status: 'out_for_delivery' },
        { 
          deliveryPartner: null,
          status: 'pending'
        }
      );
    }

    res.json(partner);
  } catch (error) {
    console.error('Error toggling delivery partner status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// In your delivery partner controller
export const getAvailableDeliveryPartners = async (req, res) => {
  try {
    // Find partners who are active and not currently assigned to an active delivery
    const partners = await DeliveryPartner.aggregate([
      {
        $match: {
          active: true,
          $or: [
            { currentOrder: { $exists: false } },
            { currentOrder: null }
          ]
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
          totalDeliveries: 1 // Prefer less busy partners
        }
      },
      {
        $limit: 10
      }
    ]);

    res.json(partners);
  } catch (error) {
    console.error('Error fetching available delivery partners:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getDeliveryPartnerDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [partner, stats, recentDeliveries] = await Promise.all([
      DeliveryPartner.findById(id),
      Order.aggregate([
        { 
          $match: { 
            deliveryPartner: mongoose.Types.ObjectId(id),
            status: 'delivered'
          } 
        },
        {
          $group: {
            _id: null,
            totalDeliveries: { $sum: 1 },
            totalEarnings: { $sum: '$deliveryFee' },
            avgDeliveryTime: { $avg: '$deliveryTime' },
            onTimeRate: {
              $avg: {
                $cond: [{ $lte: ["$deliveryTime", 45] }, 1, 0] // 45 mins target
              }
            }
          }
        }
      ]),
      Order.find({ 
        deliveryPartner: id,
        status: 'delivered' 
      })
      .sort({ deliveredAt: -1 })
      .limit(5)
      .populate('restaurantId', 'name')
      .populate('userId', 'name')
    ]);

    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    res.json({
      partner,
      stats: stats[0] || {
        totalDeliveries: 0,
        totalEarnings: 0,
        avgDeliveryTime: 0,
        onTimeRate: 0
      },
      recentDeliveries
    });
  } catch (error) {
    console.error('Error fetching delivery partner details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};