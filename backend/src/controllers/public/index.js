import { addCategory } from "../kitchen/foodController.js";
import {getRestroData,getRestaurantDashboardStats,sendNotifications,subscriptionNotifications,getFoodItem, getFoodData,placeOrder,createRestaurant ,addFoodItem,getAllRestaurants,getRestaurantById} from "./publicController.js";

export const publicCtrl = {getRestroData,getRestaurantDashboardStats,sendNotifications,subscriptionNotifications,getFoodItem,getAllRestaurants,
  getFoodData,placeOrder,createRestaurant,addFoodItem,addCategory,getRestaurantById
};