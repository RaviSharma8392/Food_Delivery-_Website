import FoodItem from "../../models/FoodItem.js";
import Category from "../../models/Category.js";
import Restaurant from "../../models/Restaurant.js";
import { StatusCodes } from "http-status-codes";
import { io } from "../../../server.js"; // adjust the path if needed

// ✅ ADD FOOD ITEM
export const addFoodItem = async (req, res) => {
  try {
    const { name, description, options, category, imageUrl } = req.body;

    if (!name || !options || !category) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Name, options, and category are required",
      });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const restaurant = await Restaurant.findOne({ owner: userId });
    if (!restaurant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Restaurant not found for the logged-in user",
      });
    }

    const newItem = new FoodItem({
      name,
      description,
      options,
      category,
      imageUrl: imageUrl || "",
      restaurant: restaurant._id,
      isAvailable: true,
    });

    await newItem.save();

    // ✅ EMIT to all clients
    io.emit("foodItemAdded", newItem);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Food item added successfully",
      foodItem: newItem,
    });
  } catch (error) {
    console.error("Error adding food item:", error);

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

// ✅ UPDATE AVAILABILITY
export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const updatedItem = await FoodItem.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // ✅ EMIT update
    io.emit("foodAvailabilityUpdated", updatedItem);

    res.json({
      success: true,
      message: "Availability updated",
      foodItem: updatedItem,
    });
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ DELETE FOOD ITEM
export const deleteFoodItemById = async (req, res) => {
  try {
    const deletedItem = await FoodItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    // ✅ EMIT deletion
    io.emit("foodItemDeleted", deletedItem._id);

    res.json({ success: true, message: "Food item deleted", deletedItem });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting food item" });
  }
};

// ✅ GET FOOD ITEMS BY RESTAURANT
export const getFoodItemsByRestaurantId = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const restaurant = await Restaurant.findOne({ owner: userId });
    if (!restaurant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Restaurant not found for the logged-in user",
      });
    }

    const foodItems = await FoodItem.find({ restaurant: restaurant._id });

    res.status(200).json({
      success: true,
      foodItems,
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching food items",
    });
  }
};

// ✅ ADD CATEGORY
export const addCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = new Category({
      name: name.trim(),
      image: image || "",
    });

    await category.save();

    // You can emit here if frontend needs real-time category updates
    // io.emit("categoryAdded", category);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Category added successfully!",
      category,
    });
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error adding category",
    });
  }
};

// ✅ GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.status(StatusCodes.OK).json({ success: true, categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};
