import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1/kitchen`,
  headers: {
    "Content-Type": "application/json",
  },
});

const fetchFoodList = async () => {
  const res = await API.get("/foodItems");
  return res.data.foodItems || [];
};

const deleteFoodItem = async (id) => {
  const res = await API.delete(`/deletefooditem/${id}`);
  return res.data;
};

const updateFoodAvailability = async (id, isAvailable) => {
  const res = await API.patch(`/updateavailability/${id}`, { isAvailable });
  return res.data;
};

const DeleteItems = () => {
  const [items, setItems] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);
  const [toggleLoading, setToggleLoading] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchFoodList();
        setItems(data);
      } catch (err) {
        console.error("Failed to load items", err);
        toast.error("Failed to fetch food items");
      }
    };
    loadItems();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmDelete = await new Promise((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="text-center mb-4">
              Are you sure you want to delete <strong>{name}</strong>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          duration: 10000,
          position: "top-center",
          style: {
            minWidth: "300px",
          },
        }
      );
    });

    if (!confirmDelete) return;

    setLoadingIds((prev) => [...prev, id]);
    const toastId = toast.loading(`Deleting ${name}...`);

    try {
      await deleteFoodItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success(`${name} deleted successfully`, { id: toastId });
    } catch (err) {
      toast.error(`Failed to delete ${name}`, { id: toastId });
    } finally {
      setLoadingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleToggleAvailability = async (id, currentStatus, name) => {
    if (toggleLoading.includes(id)) return;
    setToggleLoading((prev) => [...prev, id]);
    const toastId = toast.loading(`Updating ${name}...`);

    try {
      await updateFoodAvailability(id, !currentStatus);
      const updated = items.map((item) =>
        item._id === id ? { ...item, isAvailable: !currentStatus } : item
      );
      setItems(updated);
      toast.success(
        `${name} is now ${!currentStatus ? "available" : "unavailable"}`,
        { id: toastId }
      );
    } catch (err) {
      toast.error(`Error updating ${name}`, { id: toastId });
    } finally {
      setToggleLoading((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Manage Menu Items
          </h2>
          <p className="text-gray-500 text-center mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} in your menu
          </p>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search food items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition pl-10"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
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

        {filteredItems.length === 0 ? (
          <div className="text-center py-10">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {searchQuery ? "No matching items found" : "No items to display"}
            </h3>
            <p className="mt-1 text-gray-500">
              {searchQuery
                ? "Try a different search term"
                : "Add some items to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/80"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <div className="flex items-center mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      handleToggleAvailability(
                        item._id,
                        item.isAvailable,
                        item.name
                      )
                    }
                    disabled={toggleLoading.includes(item._id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                      item.isAvailable ? "bg-orange-500" : "bg-gray-200"
                    } ${toggleLoading.includes(item._id) ? "opacity-50" : ""}`}>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        item.isAvailable ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => handleDelete(item._id, item.name)}
                    disabled={loadingIds.includes(item._id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      loadingIds.includes(item._id)
                        ? "bg-gray-300 text-gray-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    } transition`}>
                    {loadingIds.includes(item._id) ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteItems;
