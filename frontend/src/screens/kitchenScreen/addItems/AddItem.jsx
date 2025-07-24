import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

// Axios base URL from .env
const host = import.meta.env.VITE_API_BASE_URL;

export default function AddItems() {
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState("option");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    imageUrl: "",
    isAvailable: true,
    options: { Half: "", Full: "" },
    portion: "",
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${host}/api/v1/kitchen/categories`);
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        toast.error("Failed to fetch categories");
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "Half" || name === "Full") {
      setFormData((prev) => ({
        ...prev,
        options: { ...prev.options, [name]: value },
      }));
    } else if (name === "isAvailable") {
      setFormData((prev) => ({
        ...prev,
        isAvailable: checked,
      }));
    } else if (name === "imageUrl") {
      setFormData((prev) => ({ ...prev, imageUrl: value }));
      setPreview(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const buildPayload = () => {
    const {
      name,
      description,
      category,
      imageUrl,
      isAvailable,
      options,
      portion,
    } = formData;

    if (!name.trim() || !category.trim()) {
      throw new Error("Name and category are required.");
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      category,
      isAvailable,
      imageUrl: imageUrl.trim(),
    };

    if (activeInput === "portion") {
      if (!portion.trim()) {
        throw new Error("Portion price is required.");
      }
      payload.options = [{ size: "One", price: Number(portion.trim()) }];
    } else {
      const cleanedOptions = [];
      Object.entries(options).forEach(([key, val]) => {
        if (val.trim()) {
          cleanedOptions.push({ size: key, price: Number(val.trim()) });
        }
      });

      if (cleanedOptions.length === 0) {
        throw new Error("At least one option price (Half/Full) is required.");
      }

      payload.options = cleanedOptions;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Adding item...");

    try {
      const payload = buildPayload();

      await axios.post(`${host}/api/v1/kitchen/addfooditem`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Item added successfully!", { id: toastId });
      setFormData({
        name: "",
        description: "",
        category: "",
        imageUrl: "",
        isAvailable: true,
        options: { Half: "", Full: "" },
        portion: "",
      });
      setPreview(null);
      setActiveInput("option");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Check inputs.";
      toast.error(`Failed to add item: ${message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Add New Menu Item
          </h2>
          <p className="text-gray-500 mt-1">Fill in the details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter food name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Enter image URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveInput("option")}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                activeInput === "option"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}>
              Options
            </button>
            <button
              type="button"
              onClick={() => setActiveInput("portion")}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                activeInput === "portion"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}>
              Portion
            </button>
          </div>

          {activeInput === "option" && (
            <div className="space-y-2">
              <input
                type="number"
                name="Half"
                value={formData.options.Half}
                onChange={handleChange}
                placeholder="Half price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <input
                type="number"
                name="Full"
                value={formData.options.Full}
                onChange={handleChange}
                placeholder="Full price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          )}

          {activeInput === "portion" && (
            <div>
              <input
                type="number"
                name="portion"
                value={formData.portion}
                onChange={handleChange}
                placeholder="Price for Portion"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              id="availableCheckbox"
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label
              htmlFor="availableCheckbox"
              className="ml-2 block text-sm text-gray-700">
              Available
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}>
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
