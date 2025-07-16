import React, { useEffect, useState } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { fetchFoodList } from "../../api/publicApi/foodItem";

const FoodDisplay = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFoodList();

        // Check if expected data exists
        if (response && response.foodCategories && response.foodItems) {
          setCategories(response.foodCategories);
          setItems(response.foodItems);
          setFilterItems(response.foodItems);
        } else {
          console.warn("Unexpected response format", response);
        }
      } catch (error) {
        console.error("Failed to fetch food data:", error);
      }
    };

    fetchData();
  }, []);

  const filterData = (category = activeCategory, term = searchTerm) => {
    setActiveCategory(category);
    setSearchTerm(term);

    let filtered = items;

    if (category !== "all") {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (term.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilterItems(filtered);
  };

  return (
    <div className="food-display">
      <h2 className="food-display-title">What's on your mind?</h2>

      {/* Search Box */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1.5rem",
        }}>
        <input
          type="text"
          placeholder="Search food..."
          value={searchTerm}
          onChange={(e) => filterData(activeCategory, e.target.value)}
          style={{
            padding: "0.6rem 1rem",
            border: "2px solid #ff6b6b",
            borderRadius: "25px",
            width: "100%",
            maxWidth: "300px",
            fontSize: "1rem",
            transition: "border-color 0.3s",
          }}
        />
      </div>

      {/* Category Buttons */}
      <div className="category-buttons">
        <button
          className={`category-button ${
            activeCategory === "all" ? "active" : ""
          }`}
          onClick={() => filterData("all", searchTerm)}>
          All
        </button>

        {categories.map((category) => (
          <button
            key={category._id}
            className={`category-button ${
              activeCategory === category._id ? "active" : ""
            }`}
            onClick={() => filterData(category._id, searchTerm)}>
            {category.name}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      <div className="food-grid">
        {filterItems.map((item) => (
          <FoodItem
            key={item._id}
            id={item._id}
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.imageUrl}
            options={item.options}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
