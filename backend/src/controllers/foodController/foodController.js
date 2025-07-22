// controllers/foodController.js
import FoodItem from "../../models/FoodItem.js";
import Category from "../../models/Category.js";
import Restaurant from "../../models/Restaurant.js";

export const getItemsByLocationAndCategory = async (req, res) => {
  try {
    const { location, category } = req.params;

    // Step 1: Find all restaurants in the location
    const restaurants = await Restaurant.find({
      mainLocation: { $regex: new RegExp(location, "i") },
    });

    const restaurantIds = restaurants.map((r) => r._id);

    if (!restaurantIds.length) {
      return res.status(404).json({ message: "No restaurants in this location." });
    }

    // Step 2: Find category by name and restaurant
    const categories = await Category.find({
      name: { $regex: new RegExp("^" + category + "$", "i") },
      restaurant: { $in: restaurantIds },
    });

    const categoryIds = categories.map((cat) => cat._id);

    if (!categoryIds.length) {
      return res.status(404).json({ message: "Category not found in this location." });
    }

    // Step 3: Find food items with those category and restaurant IDs
    const items = await FoodItem.find({
      restaurant: { $in: restaurantIds },
      category: { $in: categoryIds },
    })
      .populate("category")
      .populate("restaurant");
console.log(items)
    res.json(items);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
