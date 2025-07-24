import { format } from "date-fns";

const OrderTable = ({ orders, onStatusUpdate, onAssignDelivery }) => {
  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    preparing: "bg-blue-100 text-blue-800",
    ready_for_delivery: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Restaurant
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Delivery
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => {
            const {
              _id,
              user,
              address,
              restaurant,
              items,
              method,
              subtotal,
              deliveryFee,
              totalAmount,
              status,
              createdAt,
              deliveryPartner,
            } = order;

            return (
              <tr key={_id} className="hover:bg-gray-50 transition-colors">
                {/* Customer */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {user?.name || "Guest"}
                  </div>
                </td>

                {/* Contact + Address */}
                <td className="px-4 py-3">
                  <div className="text-gray-900">
                    {user?.phone || user?.email || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-1">
                    {address}
                  </div>
                </td>

                {/* Restaurant */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {restaurant?.logo && (
                      <img
                        src={restaurant.logo}
                        alt={restaurant.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <span className="text-gray-900">{restaurant?.name}</span>
                  </div>
                </td>

                {/* Items */}
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    {items.map(({ item, quantity, portion }, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">{item?.name}</span>{" "}
                        <span className="text-gray-500">
                          ({portion}) × {quantity}
                        </span>
                        <div className="text-xs text-gray-500">
                          ₹{item?.options?.[portion] || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>

                {/* Payment Method */}
                <td className="px-4 py-3 whitespace-nowrap capitalize">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    {method}
                  </span>
                </td>

                {/* Amounts */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="text-gray-500">Sub: ₹{subtotal}</div>
                    <div className="text-gray-500">Del: ₹{deliveryFee}</div>
                    <div className="font-medium">Total: ₹{totalAmount}</div>
                  </div>
                </td>

                {/* Delivery Partner */}
                <td className="px-4 py-3">
                  {deliveryPartner ? (
                    <div className="text-sm">
                      <div className="font-medium">{deliveryPartner.name}</div>
                      <div className="text-blue-600">
                        {deliveryPartner.phone}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                      Unassigned
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full capitalize ${
                      statusColors[status] || "bg-gray-100 text-gray-800"
                    }`}>
                    {status.replace(/_/g, " ")}
                  </span>
                </td>

                {/* Time */}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(createdAt), "MMM dd, yyyy")}
                  <br />
                  {format(new Date(createdAt), "hh:mm a")}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => onStatusUpdate(_id, "delivered")}
                      className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition">
                      Mark Delivered
                    </button>
                    <button
                      onClick={() => onAssignDelivery(order)}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition">
                      Assign Delivery
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
