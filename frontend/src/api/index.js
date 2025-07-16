import { getSalesToday, getWeeklySales,getMonthlySalesCash,getMonthlySalesOnline } from "./adminApi/adminApi"
import {signupUser} from "./publicApi/auth"
import { fetchFoodList } from "./publicApi/foodItem"
import placeOrderAPI from "./publicApi/placeOrder"

export {
    signupUser,fetchFoodList,getSalesToday,getWeeklySales,getMonthlySalesCash,getMonthlySalesOnline,placeOrderAPI
}