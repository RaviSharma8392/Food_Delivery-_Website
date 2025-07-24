import { Outlet, Link, useLocation, NavLink } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiTruck,
  FiSettings,
  FiUser,
  FiBell,
  FiActivity,
} from "react-icons/fi";
import useUserContext from "../../src/context/UserContext";

const SystemLayout = () => {
  const location = useLocation();
  const data = useUserContext();
  const user = data.user;
  console.log(data);
  const navItems = [
    { path: "/admin/dashboard", icon: <FiHome />, label: "Dashboard" },
    { path: "/admin/orders", icon: <FiShoppingBag />, label: "Orders" },
    { path: "/admin/restaurants", icon: <FiUsers />, label: "Restaurants" },
    {
      path: "/admin/delivery-partners",
      icon: <FiTruck />,
      label: "Delivery Partners",
    },
    {
      path: "/admin/users",
      icon: <FiUser />,
      label: "Manage Users",
    },
    {
      path: "/admin/add-category",
      icon: <FiActivity />,
      label: "Create Category",
    },
    { path: "/admin/settings", icon: <FiSettings />, label: "Settings" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">FoodDash Admin</h1>
          <p className="text-sm text-gray-500">Delivery Management System</p>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}>
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <span>A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.user.name}</p>
              <p className="text-xs text-gray-500">{user.user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {navItems.find((item) => item.path === location.pathname)?.label ||
              "Dashboard"}
          </h2>
          <div className="flex items-center space-x-4">
            <NavLink
              to={"/admin/orders"}
              className="p-2 rounded-full hover:bg-gray-100">
              <FiBell className="text-gray-600" />
            </NavLink>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium">AU</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SystemLayout;
