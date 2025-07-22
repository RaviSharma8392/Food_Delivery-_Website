import Joi from 'joi';

// Common validations
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{3,6}$/;
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const restaurantSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  cuisineType: Joi.array().items(Joi.string()).min(1).required(),
  contact: Joi.object({
    phone: Joi.string().pattern(phoneRegex).required(),
    email: Joi.string().email().required()
  }).required(),
  openingHours: Joi.string().required(),
  deliveryRadius: Joi.number().min(1).max(50).default(5),
  imageUrl: Joi.string().uri().optional(),
  isActive: Joi.boolean().default(true)
});

export const deliveryPartnerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  phone: Joi.string().pattern(phoneRegex).required(),
  email: Joi.string().email().optional(),
  vehicleType: Joi.string().valid('bike', 'scooter', 'car').required(),
  vehicleNumber: Joi.string().required(),
  isActive: Joi.boolean().default(true)
});

export const orderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')
    .required(),
  reason: Joi.string().when('status', {
    is: 'cancelled',
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  })
});

export const assignDeliverySchema = Joi.object({
  deliveryPartnerId: Joi.string().pattern(objectIdRegex).required()
});

export const analyticsPeriodSchema = Joi.object({
  period: Joi.string().valid('day', 'week', 'month', 'year').default('week'),
  restaurantId: Joi.string().pattern(objectIdRegex).optional()
});

export const idParamSchema = Joi.object({
  id: Joi.string().pattern(objectIdRegex).required()
});