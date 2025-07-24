import { useState, useEffect } from "react";
import { FiX, FiSave } from "react-icons/fi";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ""; // adjust if needed

const RestaurantFormModal = ({ restaurant, onSave, onClose }) => {
  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    images: [""],
    address: "",
    phone: "",
    email: "",
    mainLocation: "",
    subLocation: "",
    cuisine: "",
    avgRating: 0,
    totalRatings: 0,
    deliveryTime: 30,
    costForTwo: "₹500 for two",
    promoted: false,
    active: true,
    owner: "",
  });

  useEffect(() => {
    if (restaurant) {
      setFormData({
        ...restaurant,
        images: restaurant.images?.length ? restaurant.images : [""],
      });
    }
  }, [restaurant]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/admin/owners`);
        setOwners(res.data || []);
      } catch (err) {
        console.error("Failed to fetch owners:", err);
      }
    };
    fetchOwners();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">
            {restaurant ? "Edit Restaurant" : "Add New Restaurant"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Restaurant Name *"
              className="border rounded p-2"
            />
            <input
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              required
              placeholder="Cuisine Type *"
              className="border rounded p-2"
            />
            <input
              name="mainLocation"
              value={formData.mainLocation}
              onChange={handleChange}
              required
              placeholder="Main Location *"
              className="border rounded p-2"
            />
            <input
              name="subLocation"
              value={formData.subLocation}
              onChange={handleChange}
              placeholder="Sub Location"
              className="border rounded p-2"
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Full Address *"
              className="border rounded p-2"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Contact Phone *"
              className="border rounded p-2"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="border rounded p-2"
            />

            {/* Owner dropdown */}
            <select
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              required
              className="border rounded p-2">
              <option value="">Select Owner *</option>
              {owners.map((owner) => (
                <option key={owner._id} value={owner._id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>

            {/* Logo & Cost */}
            <input
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="Logo URL"
              className="border rounded p-2"
            />
            <input
              name="costForTwo"
              value={formData.costForTwo}
              onChange={handleChange}
              placeholder="Cost For Two (₹)"
              className="border rounded p-2"
            />

            {/* Delivery & Ratings */}
            <input
              type="number"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              placeholder="Delivery Time (min)"
              className="border rounded p-2"
            />
            <input
              type="number"
              name="avgRating"
              step="0.1"
              value={formData.avgRating}
              onChange={handleChange}
              placeholder="Average Rating"
              className="border rounded p-2"
            />
            <input
              type="number"
              name="totalRatings"
              value={formData.totalRatings}
              onChange={handleChange}
              placeholder="Total Ratings"
              className="border rounded p-2"
            />
          </div>

          {/* Image Gallery */}
          <div>
            <label className="block font-medium text-sm mb-1">
              Image Gallery
            </label>
            {formData.images.map((img, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="border rounded p-2 w-full"
                  placeholder={`Image URL ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="text-red-500 font-bold">
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="text-blue-600 mt-2 text-sm">
              + Add Image
            </button>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <span>Active</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="promoted"
                checked={formData.promoted}
                onChange={handleChange}
              />
              <span>Promoted</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-6 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
              <FiSave className="mr-2" />
              Save Restaurant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantFormModal;
