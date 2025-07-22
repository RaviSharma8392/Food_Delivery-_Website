import {
  FiEdit2,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiStar,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const RestaurantTable = ({ restaurants, onEdit, onToggleStatus, onDelete }) => {
  if (!restaurants)
    return <div className="text-center py-8">Loading restaurants...</div>;
  if (restaurants.length === 0)
    return <div className="text-center py-8">No restaurants found</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Name
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Cuisine
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Location
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Status
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Rating
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {restaurants.map((restaurant) => (
            <tr key={restaurant._id} className="hover:bg-gray-50">
              <td className="py-4 px-4">
                <Link
                  to={`/system/restaurants/${restaurant._id}`}
                  className="font-medium text-blue-600 hover:underline">
                  {restaurant.name}
                </Link>
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">
                {Array.isArray(restaurant.cuisineType)
                  ? restaurant.cuisineType.join(", ")
                  : restaurant.cuisine || "N/A"}
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">
                {restaurant.mainLocation && restaurant.subLocation
                  ? `${restaurant.mainLocation}, ${restaurant.subLocation}`
                  : restaurant.address || "N/A"}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    restaurant.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {restaurant.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center">
                  <FiStar className="text-yellow-400 mr-1" />
                  <span>
                    {restaurant.avgRating?.toFixed(1) ||
                      restaurant.rating?.toFixed(1) ||
                      "N/A"}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(restaurant)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    aria-label="Edit restaurant">
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() =>
                      onToggleStatus(restaurant._id, restaurant.active)
                    }
                    className="text-gray-600 hover:text-gray-800 p-1"
                    aria-label={restaurant.active ? "Deactivate" : "Activate"}>
                    {restaurant.active ? (
                      <FiToggleRight size={18} className="text-green-500" />
                    ) : (
                      <FiToggleLeft size={18} className="text-red-500" />
                    )}
                  </button>
                  <button
                    onClick={() => onDelete(restaurant._id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    aria-label="Delete restaurant">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantTable;
