import { addCategory } from "../kitchen/foodController.js";
import {getFilteredFoodItems,getCategoryByName,getRestaurantsByLocationAndCategory,getRestroData,getRestaurantDashboardStats,sendNotifications,subscriptionNotifications,getFoodItem, getFoodData,placeOrder,createRestaurant ,addFoodItem,getAllRestaurants,getRestaurantById} from "./publicController.js";

export const publicCtrl = {getFilteredFoodItems,getCategoryByName,getRestaurantsByLocationAndCategory,getRestroData,getRestaurantDashboardStats,sendNotifications,subscriptionNotifications,getFoodItem,getAllRestaurants,
  getFoodData,placeOrder,createRestaurant,addFoodItem,addCategory,getRestaurantById
};