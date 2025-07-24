import { Outlet, Link, useLocation } from "react-router-dom";
import { FaBell, FaSearch, FaHome } from "react-icons/fa";
import { IoFastFood } from "react-icons/io5";
import { Trash2 } from "lucide-react";
import { BsPlusCircleDotted } from "react-icons/bs";
import "./RestaurantLayout.css";
import useUserContext from "../context/UserContext";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../../socket";

// Axios setup
axios.defaults.baseURL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
axios.defaults.withCredentials = true;

const RestaurantLayout = () => {
  const location = useLocation();
  const data = useUserContext();
  const userRef = data.user.user;
  const [pendingOrders, setPendingOrders] = useState([]);

  const fetchPendingOrders = async () => {
    try {
      const res = await axios.get("/kitchen/orders");
      const pending = res.data.filter((order) => order.status === "pending");
      setPendingOrders(pending);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchPendingOrders();

    socket.connect(); // ✅ Make sure it's connected

    // 🧠 Order status updates
    socket.on("order-updated", (order) => {
      if (order.status === "pending") {
        setPendingOrders((prev) => {
          const exists = prev.find((o) => o._id === order._id);
          return exists ? prev : [...prev, order];
        });

        toast.custom(
          <div className="bg-white shadow-md rounded-lg p-4 w-[300px]">
            <div className="font-semibold mb-2 text-orange-600">
              New Order #{order._id.slice(-6).toUpperCase()}
            </div>
            <div className="text-sm text-gray-600">
              {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
            </div>
          </div>,
          { duration: 7000 }
        );
      } else {
        setPendingOrders((prev) => prev.filter((o) => o._id !== order._id));
      }
    });

    // 🔌 Clean up on unmount
    return () => {
      socket.off("order-updated");
      socket.disconnect(); // ✅ avoid memory leaks
    };
  }, []);

  const showPendingOrdersToast = () => {
    if (pendingOrders.length === 0) {
      toast("No pending orders 🎉", { icon: "✅" });
    } else {
      pendingOrders.forEach((order) => {
        toast.custom(
          <div className="bg-white shadow-md rounded-lg p-4 w-[300px]">
            <div className="font-semibold mb-2 text-orange-600">
              Order #{order._id.slice(-6).toUpperCase()}
            </div>
            <div className="text-sm text-gray-600">
              Items:{" "}
              {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>,
          { duration: 7000 }
        );
      });
    }
  };

  const navItems = [
    { path: "/kitchen/dashboard", icon: <FaHome />, label: "Dashboard" },
    {
      path: "/kitchen/addItems",
      icon: <BsPlusCircleDotted />,
      label: "Add Items",
    },
    { path: "/kitchen/manageItems", icon: <Trash2 />, label: "Manage Items" },
  ];

  return (
    <div className="restaurant-container">
      <Toaster position="top-right" reverseOrder={false} />
      <header className="restaurant-header">
        <div className="header-left">
          <div className="brand-logo">
            <IoFastFood className="logo-icon" />
            <span className="brand-name">Flavors</span>
          </div>
          {/* <div className="search-bar">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search orders, items..." />
          </div> */}
        </div>

        <div className="header-right">
          <button
            className="notification-btn relative"
            onClick={showPendingOrdersToast}>
            <FaBell />
            {pendingOrders.length > 0 && (
              <span className="notification-badge">{pendingOrders.length}</span>
            )}
          </button>
          <div className="user-profile">
            <div className="avatar">A</div>
            <div className="user-info">
              <span className="user-name">{userRef.name}</span>
              <span className="user-role">{userRef.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <ul>
              {navItems.map((item) => (
                <li
                  key={item.path}
                  className={
                    location.pathname.startsWith(item.path) ? "active" : ""
                  }>
                  <Link to={item.path}>
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="content-area">
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RestaurantLayout;
