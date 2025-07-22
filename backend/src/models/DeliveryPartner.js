import mongoose from 'mongoose';

const DeliveryPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: false
  },
  vehicle: {
    type: String,
    enum: ['bike', 'scooter', 'car', 'bicycle'],
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
 
  assignedOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalDeliveries: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Geo Index
DeliveryPartnerSchema.index({ currentLocation: '2dsphere' });

export default mongoose.model('DeliveryPartner', DeliveryPartnerSchema);
