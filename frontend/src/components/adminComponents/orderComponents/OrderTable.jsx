import {
  FiTruck,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
} from "react-icons/fi";
import { format } from "date-fns";

const OrderTable = ({ orders, onStatusUpdate, onAssignDelivery }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "preparing":
        return <FiClock className="text-blue-500" />;
      case "out_for_delivery":
        return <FiTruck className="text-purple-500" />;
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiInfo className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Order ID</th>
            <th className="py-2 px-4 text-left">Customer</th>
            <th className="py-2 px-4 text-left">Restaurant</th>
            <th className="py-2 px-4 text-left">Items</th>
            <th className="py-2 px-4 text-left">Total</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">#{order._id.slice(-6)}</td>
              <td className="py-3 px-4">
                {order.userId?.name || order.name}
                <div className="text-sm text-gray-500">{order.phone}</div>
              </td>
              <td className="py-3 px-4">{order.restaurantId?.name || "N/A"}</td>
              <td className="py-3 px-4">
                {order.items.length} items
                <ul className="text-xs mt-1">
                  {order.items.slice(0, 2).map((item) => (
                    <li key={item._id}>
                      {item.quantity}x {item.itemId?.name || "Item"} (
                      {item.portion})
                    </li>
                  ))}
                  {order.items.length > 2 && (
                    <li>+{order.items.length - 2} more</li>
                  )}
                </ul>
              </td>
              <td className="py-3 px-4">₹{order.totalAmount}</td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <select
                    value={order.status}
                    onChange={(e) => onStatusUpdate(order._id, e.target.value)}
                    className={`ml-2 text-xs px-2 py-1 rounded ${getStatusColor(
                      order.status
                    )}`}>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">
                {format(new Date(order.createdAt), "MMM d, h:mm a")}
              </td>
              <td className="py-3 px-4">
                {order.status === "preparing" && (
                  <button
                    onClick={() => onAssignDelivery(order)}
                    className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">
                    Assign Delivery
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
