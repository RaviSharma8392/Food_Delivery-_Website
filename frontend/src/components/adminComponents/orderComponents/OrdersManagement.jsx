// // export default OrdersManagement;
// import { useState, useEffect } from "react";
// import axios from "axios";
// import OrderTable from "./OrderTable";
// import OrderFilters from "./OrderFilters";
// import AssignDeliveryModal from "./AssignDeliveryModal";

// const OrdersManagement = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [filters, setFilters] = useState({});

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get("/api/v1/admin/orders", {
//           params: filters,
//         });
//         setOrders(response.data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [filters]);

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       await axios.patch(`/api/v1/admin/orders/${orderId}/status`, {
//         status: newStatus,
//       });
//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus } : order
//         )
//       );
//     } catch (error) {
//       console.error("Error updating order status:", error);
//     }
//   };

//   const assignDeliveryPartner = async (orderId, partnerId) => {
//     try {
//       await axios.patch(`/api/v1/admin/orders/${orderId}/assign`, {
//         deliveryPartner: partnerId,
//       });
//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === orderId
//             ? {
//                 ...order,
//                 deliveryPartner: partnerId,
//                 status: "out_for_delivery",
//               }
//             : order
//         )
//       );
//       setShowAssignModal(false);
//     } catch (error) {
//       console.error("Error assigning delivery partner:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Order Management</h1>

//       <OrderFilters filters={filters} setFilters={setFilters} />

//       {loading ? (
//         <div className="text-center py-8">Loading orders...</div>
//       ) : (
//         <OrderTable
//           orders={orders}
//           onStatusUpdate={updateOrderStatus}
//           onAssignDelivery={(order) => {
//             setSelectedOrder(order);
//             setShowAssignModal(true);
//           }}
//         />
//       )}

//       {showAssignModal && (
//         <AssignDeliveryModal
//           order={selectedOrder}
//           onClose={() => setShowAssignModal(false)}
//           onAssign={assignDeliveryPartner}
//         />
//       )}
//     </div>
//   );
// };

// export default OrdersManagement;
