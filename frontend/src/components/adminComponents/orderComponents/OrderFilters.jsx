import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const OrderFilters = ({ filters, setFilters, restaurantOptions }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (startDate && endDate) {
      setFilters({
        ...filters,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    } else {
      const { startDate, endDate, ...rest } = filters;
      setFilters(rest);
    }
  }, [startDate, endDate]);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value || undefined })
            }
            className="w-full border rounded px-3 py-2 text-sm">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Restaurant
          </label>
          <select
            value={filters.restaurantId || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                restaurantId: e.target.value || undefined,
              })
            }
            className="w-full border rounded px-3 py-2 text-sm">
            <option value="">All Restaurants</option>
            {restaurantOptions.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable
            placeholderText="Select date range"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Status
          </label>
          <select
            value={filters.deliveryStatus || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                deliveryStatus: e.target.value || undefined,
              })
            }
            className="w-full border rounded px-3 py-2 text-sm">
            <option value="">All</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
