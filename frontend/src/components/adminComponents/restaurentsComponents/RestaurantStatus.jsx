import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const RestaurantStatus = () => {
  const [restaurantStats, setRestaurantStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchRestaurantStats = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/admin/restaurants/stats`
        );
        console.log(response);
        setRestaurantStats(response.data);
      } catch (err) {
        console.error("Error fetching restaurant stats:", err);
        setError("Failed to load restaurant statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantStats();
  }, [BASE_URL]);

  const toggleRestaurantStatus = async (restaurantId, currentStatus) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/v1/admin/restaurants/${restaurantId}/toggle-status`,
        {
          active: !currentStatus,
        }
      );

      // Refresh stats after update
      const response = await axios.get(
        `${BASE_URL}/api/v1/admin/restaurants/stats`
      );
      setRestaurantStats(response.data);
    } catch (err) {
      console.error("Error toggling restaurant status:", err);
      setError("Failed to update restaurant status");
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading restaurant stats...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Restaurant Status</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 text-sm rounded ${
              activeFilter === "all"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100"
            }`}>
            All ({restaurantStats.total})
          </button>
          <button
            onClick={() => setActiveFilter("active")}
            className={`px-3 py-1 text-sm rounded ${
              activeFilter === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100"
            }`}>
            Active ({restaurantStats.active})
          </button>
          <button
            onClick={() => setActiveFilter("inactive")}
            className={`px-3 py-1 text-sm rounded ${
              activeFilter === "inactive"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100"
            }`}>
            Inactive ({restaurantStats.inactive})
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 text-sm">Total Restaurants</h3>
                <p className="text-2xl font-bold">{restaurantStats.total}</p>
              </div>
              <FiCheckCircle className="text-blue-500 text-xl" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 text-sm">Active Restaurants</h3>
                <p className="text-2xl font-bold text-green-600">
                  {restaurantStats.active}
                </p>
              </div>
              <FiTrendingUp className="text-green-500 text-xl" />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 text-sm">Inactive Restaurants</h3>
                <p className="text-2xl font-bold text-red-600">
                  {restaurantStats.inactive}
                </p>
              </div>
              <FiXCircle className="text-red-500 text-xl" />
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 text-sm">Avg. Rating</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {restaurantStats.avgRating
                    ? restaurantStats.avgRating.toFixed(1)
                    : "N/A"}
                </p>
              </div>
              <FiStar className="text-yellow-500 text-xl" />
            </div>
          </div>
        </div>

        <h3 className="font-medium mb-2 flex items-center">
          <FiClock className="mr-2" /> Recent Restaurant Activity
        </h3>

        {restaurantStats.recentActivity &&
        restaurantStats.recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 text-left text-sm">Restaurant</th>
                  <th className="py-2 px-4 text-left text-sm">Status</th>
                  <th className="py-2 px-4 text-left text-sm">
                    Orders (Today)
                  </th>
                  <th className="py-2 px-4 text-left text-sm">Rating</th>
                  <th className="py-2 px-4 text-left text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {restaurantStats.recentActivity
                  .filter(
                    (restaurant) =>
                      activeFilter === "all" ||
                      (activeFilter === "active" && restaurant.active) ||
                      (activeFilter === "inactive" && !restaurant.active)
                  )
                  .map((restaurant) => (
                    <tr key={restaurant._id}>
                      <td className="py-3 px-4">
                        <Link
                          to={`/admin/restaurants/${restaurant._id}`}
                          className="font-medium text-blue-600 hover:underline">
                          {restaurant.name}
                        </Link>
                        <div className="text-sm text-gray-500">
                          {restaurant.cuisine}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            restaurant.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                          {restaurant.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="font-medium">
                            {restaurant.todayOrders || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FiStar className="text-yellow-500 mr-1" />
                          <span>
                            {restaurant.avgRating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            toggleRestaurantStatus(
                              restaurant._id,
                              restaurant.active
                            )
                          }
                          className={`text-xs px-3 py-1 rounded ${
                            restaurant.active
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}>
                          {restaurant.active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent restaurant activity
          </div>
        )}

        <div className="mt-4 text-right">
          <Link
            to="/admin/restaurants"
            className="text-sm text-blue-600 hover:underline">
            View all restaurants →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantStatus;
