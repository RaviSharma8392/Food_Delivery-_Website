import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FaUtensils,
  FaClipboardList,
  FaUsers,
  FaCog,
  FaHome,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import { IoFastFood } from "react-icons/io5";
import "./RestaurantLayout.css";

const RestaurantLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: "/restaurant/dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/restaurant/orders", icon: <FaClipboardList />, label: "Orders" },
    { path: "/restaurant/menu", icon: <FaUtensils />, label: "Menu" },
    { path: "/restaurant/staff", icon: <FaUsers />, label: "Staff" },
    { path: "/restaurant/settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <div className="restaurant-container">
      {/* Header */}
      <header className="restaurant-header">
        <div className="header-left">
          <div className="brand-logo">
            <IoFastFood className="logo-icon" />
            <span className="brand-name">Flavors</span>
          </div>
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search orders, items..." />
          </div>
        </div>

        <div className="header-right">
          <button className="notification-btn">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>
          <div className="user-profile">
            <div className="avatar">A</div>
            <div className="user-info">
              <span className="user-name">Admin</span>
              <span className="user-role">Owner</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
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

        {/* Content Area */}
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
