import FoodItem from "../../models/FoodItem.js";
import Category from "../../models/Category.js";
import { StatusCodes } from "http-status-codes";

export const addFoodItem = async (req, res) => {
  try {
    const { name, description, options, category, imageUrl } = req.body;

    // Validate required fields
    if (!name || !options || !category) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Name, options, and category are required",
      });
    }

    // Hardcoded ObjectIds for testing
    const hardcodedRestaurantId = "687b44510d4db15f515e83d8";

    const newItem = new FoodItem({
      name,
      description,
      options,
      category,
      imageUrl: imageUrl || "",
      restaurant: hardcodedRestaurantId, // use fixed restaurant ID
      isAvailable: true,
    });

    await newItem.save();

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


export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await FoodItem.findByIdAndUpdate(
      id,
      { isAvailable: req.body.isAvailable },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update availability" });
  }
};

export const deleteFoodItemById = async (req, res) => {
  try {
    const deletedItem = await FoodItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }
    res.json({ success: true, message: "Food item deleted", deletedItem });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting food item" });
  }
};

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
      image: image || "", // optional field
    });

    await category.save();

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

