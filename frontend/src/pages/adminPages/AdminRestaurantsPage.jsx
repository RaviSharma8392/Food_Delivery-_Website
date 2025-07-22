import { useState, useEffect } from "react";
import RestaurantTable from "../../components/adminComponents/restaurentsComponents/RestaurantTable";
import RestaurantFormModal from "../../components/adminComponents/restaurentsComponents/RestaurantFormModal";
import {
  fetchRestaurants,
  toggleRestaurantStatus,
  saveRestaurant,
  deleteRestaurant,
} from "../../services/admin/restaurantApi";

const AdminRestaurantsPage = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await fetchRestaurants(); // No search param
        setAllRestaurants(data);
        setFilteredRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  useEffect(() => {
    const filtered = allRestaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  }, [searchTerm, allRestaurants]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updated = await toggleRestaurantStatus(id, currentStatus);

      const updatedList = allRestaurants.map((r) =>
        r._id === id ? updated : r
      );

      setAllRestaurants(updatedList);

      // Update filtered list to reflect status change in UI
      const updatedFiltered = updatedList.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(updatedFiltered);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteRestaurant(id);
      const updatedList = allRestaurants.filter((r) => r._id !== id);
      setAllRestaurants(updatedList);
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const handleSave = async (restaurantData) => {
    try {
      const saved = await saveRestaurant(restaurantData, editingRestaurant);
      const updatedList = editingRestaurant
        ? allRestaurants.map((r) => (r._id === saved._id ? saved : r))
        : [...allRestaurants, saved];

      setAllRestaurants(updatedList);
      setShowFormModal(false);
      setEditingRestaurant(null);
    } catch (error) {
      console.error("Error saving restaurant:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Restaurant Management</h1>
        <button
          onClick={() => {
            setEditingRestaurant(null);
            setShowFormModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add New Restaurant
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search restaurants..."
          className="w-full p-2 border rounded pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="absolute left-3 top-3 h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading restaurants...</div>
      ) : (
        <RestaurantTable
          restaurants={filteredRestaurants}
          onEdit={(restaurant) => {
            setEditingRestaurant(restaurant);
            setShowFormModal(true);
          }}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}

      {showFormModal && (
        <RestaurantFormModal
          restaurant={editingRestaurant}
          onSave={handleSave}
          onClose={() => {
            setShowFormModal(false);
            setEditingRestaurant(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminRestaurantsPage;
