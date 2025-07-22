// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Clock,
//   CheckCircle,
//   Truck,
//   RefreshCw,
//   ChefHat,
//   AlertCircle,
//   MapPin,
// } from "lucide-react";

// const RestaurantOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("pending");

//   const statusConfig = {
//     pending: {
//       icon: <Clock className="w-4 h-4" />,
//       color: "bg-amber-100 text-amber-800",
//       label: "Pending",
//       actions: ["preparing", "cancelled"],
//     },
//     preparing: {
//       icon: <ChefHat className="w-4 h-4" />,
//       color: "bg-blue-100 text-blue-800",
//       label: "Preparing",
//       actions: ["ready_for_delivery"],
//     },
//     ready_for_delivery: {
//       icon: <Truck className="w-4 h-4" />,
//       color: "bg-purple-100 text-purple-800",
//       label: "Ready",
//       actions: ["delivered"],
//     },
//     delivered: {
//       icon: <CheckCircle className="w-4 h-4" />,
//       color: "bg-green-100 text-green-800",
//       label: "Delivered",
//     },
//     cancelled: {
//       icon: <AlertCircle className="w-4 h-4" />,
//       color: "bg-red-100 text-red-800",
//       label: "Cancelled",
//     },
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get("/api/restaurant/orders");
//       setOrders(data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (orderId, status) => {
//     try {
//       await axios.patch(`/api/restaurant/orders/${orderId}`, { status });
//       fetchOrders();
//     } catch (error) {
//       console.error("Error updating order:", error);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const filteredOrders =
//     activeTab === "all"
//       ? orders
//       : orders.filter((order) => order.status === activeTab);

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-bold">Order Management</h2>
//         <button
//           onClick={fetchOrders}
//           className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
//           <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//           Refresh
//         </button>
//       </div>

//       <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
//         {["all", ...Object.keys(statusConfig)].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-full text-sm ${
//               activeTab === tab
//                 ? "bg-orange-500 text-white"
//                 : "bg-white text-gray-600"
//             }`}>
//             {tab === "all" ? "All" : statusConfig[tab]?.label || tab}
//           </button>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filteredOrders.map((order) => (
//           <div key={order._id} className="bg-white rounded-lg border p-4">
//             <div className="flex justify-between items-start mb-3">
//               <div>
//                 <h3 className="font-medium">Order #{order._id.slice(-6)}</h3>
//                 <span
//                   className={`text-xs px-2 py-1 rounded-full ${
//                     statusConfig[order.status]?.color
//                   }`}>
//                   {statusConfig[order.status]?.label}
//                 </span>
//               </div>
//               <span className="text-sm text-gray-500">
//                 {new Date(order.createdAt).toLocaleTimeString()}
//               </span>
//             </div>

//             <div className="flex items-center gap-2 text-sm mb-4">
//               <MapPin className="w-4 h-4 text-gray-500" />
//               <span>{order.deliveryArea || "Unknown area"}</span>
//             </div>

//             <div className="space-y-2 mb-4">
//               {order.items.map((item, i) => (
//                 <div key={i} className="flex justify-between text-sm">
//                   <span>
//                     {item.quantity}x {item.name}
//                   </span>
//                   <span>₹{item.price * item.quantity}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between items-center pt-3 border-t">
//               <span className="font-medium">₹{order.totalAmount}</span>
//               {statusConfig[order.status]?.actions && (
//                 <select
//                   value={order.status}
//                   onChange={(e) => updateStatus(order._id, e.target.value)}
//                   className="text-xs border rounded px-2 py-1">
//                   <option value={order.status}>Current</option>
//                   {statusConfig[order.status].actions.map((action) => (
//                     <option key={action} value={action}>
//                       Mark as {statusConfig[action]?.label}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RestaurantOrders;
