import { useState, useEffect } from "react";
import OrderTable from "../../components/adminComponents/orderComponents/OrderTable";
import OrderFilters from "../../components/adminComponents/orderComponents/OrderFilters";
import AssignDeliveryModal from "../../components/adminComponents/deliveryComponents/AssignDeliveryModal";

import {
  fetchOrders,
  updateOrderStatus,
  assignDeliveryPartner,
} from "../../services/admin/orderApi";

const OrdersPage = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [restaurantOptions, setRestaurantOptions] = useState([]);

  // Fetch orders once on mount
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchOrders();
        setAllOrders(data);

        const uniqueRestaurants = [
          ...new Map(
            data
              .filter((order) => order.restaurantId)
              .map((order) => [order.restaurantId._id, order.restaurantId])
          ).values(),
        ];
        setRestaurantOptions(uniqueRestaurants);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Apply filters client-side
  useEffect(() => {
    let result = [...allOrders];

    if (filters.status) {
      result = result.filter((order) => order.status === filters.status);
    }

    if (filters.deliveryStatus) {
      if (filters.deliveryStatus === "assigned") {
        result = result.filter((order) => order.deliveryPartner);
      } else if (filters.deliveryStatus === "unassigned") {
        result = result.filter((order) => !order.deliveryPartner);
      }
    }

    if (filters.restaurantId) {
      result = result.filter(
        (order) => order.restaurantId?._id === filters.restaurantId
      );
    }

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      result = result.filter((order) => {
        const created = new Date(order.createdAt);
        return created >= start && created <= end;
      });
    }

    setFilteredOrders(result);
  }, [filters, allOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleAssignDelivery = async (orderId, partnerId) => {
    try {
      await assignDeliveryPartner(orderId, partnerId);
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                deliveryPartner: partnerId,
                status: "out_for_delivery",
              }
            : order
        )
      );
      setShowAssignModal(false);
    } catch (error) {
      console.error("Error assigning delivery partner:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => window.print()}>
          Export Orders
        </button>
      </div>

      <OrderFilters
        filters={filters}
        setFilters={setFilters}
        restaurantOptions={restaurantOptions}
      />

      {loading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : (
        <OrderTable
          orders={filteredOrders}
          onStatusUpdate={handleStatusUpdate}
          onAssignDelivery={(order) => {
            setSelectedOrder(order);
            setShowAssignModal(true);
          }}
        />
      )}

      {showAssignModal && (
        <AssignDeliveryModal
          order={selectedOrder}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignDelivery}
        />
      )}
    </div>
  );
};

export default OrdersPage;
