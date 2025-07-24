import { useState, useEffect } from "react";
import axios from "axios";
import { FiX, FiCheck } from "react-icons/fi";

const AssignDeliveryModal = ({ order, onClose, onAssign }) => {
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [error, setError] = useState(null);

  const baseURL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
  useEffect(() => {
    const fetchAvailablePartners = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/admin/delivery-partners/available`
        );
        console.log(response);
        setDeliveryPartners(response.data);
        if (response.data.length > 0) {
          setSelectedPartner(response.data[0]._id);
        }
      } catch (err) {
        console.error("Error fetching delivery partners:", err);
        setError("Failed to load delivery partners");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailablePartners();
  }, []);

  const handleAssign = async () => {
    try {
      await onAssign(order._id, selectedPartner);
      onClose();
    } catch (err) {
      console.error("Error assigning delivery partner:", err);
      setError("Failed to assign delivery partner");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium">Assign Delivery Partner</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">
              Order #{order._id.slice(-6)}
            </p>
            <p className="font-medium">
              {order.restaurantId?.name || "Restaurant"}
            </p>
            <p className="text-sm text-gray-600">
              {order.items.length} items • ₹{order.totalAmount}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-4">
              Loading available partners...
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : deliveryPartners.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No available delivery partners at this time
            </div>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Delivery Partner
              </label>
              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4">
                {deliveryPartners.map((partner) => (
                  <option key={partner._id} value={partner._id}>
                    {partner.name} ({partner.vehicle}) - Rating:{" "}
                    {partner.rating.toFixed(1)}
                  </option>
                ))}
              </select>
            </>
          )}

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        </div>

        <div className="flex justify-end space-x-2 border-t p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading || deliveryPartners.length === 0}
            className={`px-4 py-2 rounded text-white flex items-center ${
              loading || deliveryPartners.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}>
            <FiCheck className="mr-1" /> Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignDeliveryModal;
