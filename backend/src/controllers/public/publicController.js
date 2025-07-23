import FoodItem from "../../models/FoodItem.js";
import Category from "../../models/Category.js";
import Order from "../../models/Order.js";
import sendEmailNotification from "../../utils/whatshappMessage.js";
import { StatusCodes } from "http-status-codes";
import Restaurant from "../../models/Restaurant.js";
import Subscription from "../../models/Subscription.js";
import mongoose from "mongoose";


export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id)
      // .populate("categories") // optional: if categories are refs
      // .populate("menuItems"); // optional: if menuItems are refs

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error("Error fetching restaurant by ID:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ✅ GET: All food items
export const getFoodItem = async (req, res) => {
  try {
    const menu = await FoodItem.find();
    return res.status(StatusCodes.ACCEPTED).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET: Food data by restaurant getFilteredFoodItemswith optional includes

export const getFoodData = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const include = req.query.include?.split(",") || [];

    // 🔍 Step 1: Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    let menu = [];
    let categories = [];

    // 🍽️ Step 2: Fetch menu items if requested
    if (include.includes("menu")) {
      menu = await FoodItem.find({ restaurant: restaurantId, isAvailable: true })
        .populate("category", "name") // populate only category name
        .lean();
    }

    // 🗂️ Step 3: Extract and fetch only categories that are used in the menu
    if (include.includes("categories") && menu.length > 0) {
      const categoryIds = [
        ...new Set(menu.map((item) => item.category?._id?.toString()).filter(Boolean)),
      ];

      if (categoryIds.length > 0) {
        categories = await Category.find({ _id: { $in: categoryIds } }).lean();
      }
    }

    // ✅ Step 4: Return structured response
    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        restaurant,
        menu,
        categories,
      },
    });

  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch restaurant details",
      error: error.message,
    });
  }
};
export const getFilteredFoodItems = async (req, res) => {
  try {
    const { restaurantId, categoryName } = req.query;

    if (!restaurantId || !categoryName) {
      return res.status(400).json({ message: "restaurantId and categoryName are required." });
    }

    // Step 1: Find category ID from name
    const category = await Category.findOne({ name: { $regex: new RegExp(categoryName, "i") } });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Step 2: Find food items by restaurant and category
    const foodItems = await FoodItem.find({
      restaurant: restaurantId,
      category: category._id,
    });

    res.status(200).json(foodItems);
  } catch (error) {
    console.error("Error fetching filtered food items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET: Food data by location with category includes

export const getRestaurantsByLocationAndCategory = async (req, res) => {
  try {
    const { location, category: categoryName } = req.query;

    if (!location || !categoryName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Missing location or category",
      });
    }

    // Step 1: Find category by name (case-insensitive)
    const category = await Category.findOne({
      name: { $regex: new RegExp(categoryName, "i") },
    });

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Category not found",
      });
    }

    const categoryId = category._id;

    // Step 2: Find food items matching category
    const foodItems = await FoodItem.find({ category: categoryId }).populate({
      path: "restaurant",
      match: {
        mainLocation: { $regex: new RegExp(location, "i") },
      },
    });

    // Step 3: Filter items that have a valid restaurant
    const validItems = foodItems.filter(item => item.restaurant);

    // Step 4: Extract unique restaurant IDs
    const restaurantIds = [
      ...new Set(validItems.map(item => item.restaurant._id.toString())),
    ];

    // Step 5: Get restaurants by IDs
    const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } });

    // ✅ Final Response
    return res.status(StatusCodes.OK).json({
      success: true,
      category: {
        _id: category._id,
        name: category.name,
        image: category.image || null,
      },
      restaurants,
    });

  } catch (error) {
    console.error("Error in getRestaurantsByLocationAndCategory:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ POST: Place an order
export const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      name,
      phone,
      email,
      address,
      method,
      subtotal,
      deliveryFee,
      totalAmount,
      items,
      restaurantId,
    } = req.body;

    if (
      !restaurantId ||
      !address ||
      !method ||
      !subtotal ||
      !deliveryFee ||
      !totalAmount ||
      !items?.length
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Missing required order details",
      });
    }

    if (!userId && (!name || !phone)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Guest orders must include name and phone",
      });
    }

    const newOrder = new Order({
      userId: userId || null,
      name,
      phone,
      email,
      address,
      method,
      subtotal,
      deliveryFee,
      totalAmount,
      items,
      restaurantId,
    });

    await newOrder.save();

    await sendEmailNotification({
      userId,
      name,
      phone,
      email,
      address,
      method,
      subtotal,
      deliveryFee,
      totalAmount,
      items,
      restaurantId,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Order placed successfully!",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ POST: Create a new restaurant
export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      logo,
      address,
      phone,
      email,
      mainLocation,
      subLocation,
      owner,
      cuisine,
      avgRating,
      totalRatings,
      deliveryTime,
      costForTwo,
      image,
      promoted,
    } = req.body;

    if (!name || !mainLocation || !subLocation || !owner || !cuisine) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          "Name, mainLocation, subLocation, owner, and cuisine are required",
      });
    }

    const existing = await Restaurant.findOne({ name });
    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Restaurant already exists",
      });
    }

    const newRestaurant = new Restaurant({
      name,
      logo,
      address,
      phone,
      email,
      mainLocation,
      subLocation,
      owner,
      cuisine,
      avgRating: avgRating || 0,
      totalRatings: totalRatings || 0,
      deliveryTime: deliveryTime || 30,
      costForTwo: costForTwo || "₹500 for two",
      image: image || "https://via.placeholder.com/300x200?text=Restaurant",
      promoted: promoted || false,
    });

    await newRestaurant.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant: newRestaurant,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create restaurant",
      error: error.message,
    });
  }
};

// ✅ POST: Add new food item (temporary hardcoded restaurant)
export const addFoodItem = async (req, res) => {
  try {
    const { name, description, options, category, imageUrl } = req.body;

    if (!name || !options || !category) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Name, options, and category are required",
      });
    }

    const hardcodedRestaurantId = "687b44510d4db15f515e83d8";

    const newItem = new FoodItem({
      name,
      description,
      options,
      category,
      imageUrl: imageUrl || "",
      restaurant: hardcodedRestaurantId,
      isAvailable: true,
    });

    await newItem.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Food item added successfully",
      foodItem: newItem,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Food item with this name already exists",
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to add food item",
      error: error.message,
    });
  }
};

// ✅ GET: All restaurants with optional city filter
export const getAllRestaurants = async (req, res) => {
  try {
    const { city } = req.query;

    const filter = city ? { mainLocation: city } : {};
    const restaurants = await Restaurant.find(filter).sort({
      promoted: -1,
      avgRating: -1,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error fetching restaurants",
    });
  }
};

export const subscriptionNotifications=async (req, res) => {
  const { subscription, location } = req.body;
  try {
    await Subscription.create({ ...subscription, location });
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
export const sendNotifications = async (req, res) => {
  const { location, title, message, url, image } = req.body;

  try {
    const subs = await Subscription.find({ location });

    const payload = JSON.stringify({
      title,
      body: message,
      url: url || "/", // Optional: link to open when clicked
      image: image || "", // Optional: thumbnail
      icon: "https://yourdomain.com/logo.png", // Optional: your logo
    });

    let successCount = 0;

    for (let sub of subs) {
      try {
        await webpush.sendNotification(sub, payload);
        successCount++;
      } catch (err) {
        console.error("❌ Push failed for 1 user", err.message);
      }
    }

    res.json({ success: true, sent: successCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getRestroData=async (req, res) => {
  const slug = req.params.slug;
  console.log()
  const restaurantName = slug.replace(/-/g, " ");
  try {
    const restaurant = await Restaurant.findOne({
      name: new RegExp(`^${restaurantName}$`, "i"), // case-insensitive match
    });
    if (!restaurant) return res.status(404).json({ message: "Not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export const getRestaurantDashboardStats = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const orders = await Order.find({ restaurantId });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const itemsSold = orders.reduce((sum, order) => {
      return sum + order.items.reduce((iSum, item) => iSum + item.quantity, 0);
    }, 0);

    // Weekly orders (last 7 days)
    const weekly = Array(7).fill(0);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    orders.forEach((order) => {
      const day = new Date(order.createdAt).getDay();
      weekly[day]++;
    });

    // Monthly revenue (last 6 months)
    const monthly = Array(6).fill(0);
    const now = new Date();
    orders.forEach((order) => {
      const monthDiff =
        now.getMonth() - new Date(order.createdAt).getMonth() +
        12 * (now.getFullYear() - new Date(order.createdAt).getFullYear());
      if (monthDiff < 6) {
        monthly[5 - monthDiff] += order.totalAmount;
      }
    });

    const restro = await Restaurant.findById(restaurantId);

    res.json({
      success: true,
      stats: {
        totalOrders,
        revenue: totalRevenue,
        itemsSold,
        customerSatisfaction: 4.5, // Placeholder
      },
      weeklyOrders: {
        labels: days,
        data: weekly,
      },
      monthlyRevenue: {
        labels: Array.from({ length: 6 }, (_, i) =>
          new Date(now.getFullYear(), now.getMonth() - 5 + i).toLocaleString("default", { month: "short" })
        ),
        data: monthly,
      },
      // profile: {
      //   name: restro.name,
      //   email: restro.email,
      //   city: restro.city,
      // },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getCategoryByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Category name is required.",
      });
    }

    // Search category by name (case-insensitive)
    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Category not found.",
      });
    }

    return res.status(StatusCodes.OK).json({
      _id: category._id,
      name: category.name,
      image: category.image || null,
    });

  } catch (error) {
    console.error("Error in getCategoryByName:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
