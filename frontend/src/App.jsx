import React, { lazy, useEffect, useState, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ProtectRoute from "./protectedRoute/ProtectRoutes";
import ErrorBoundary from "./components/errorComponents/ErrorBoundary";
import useUserContext from "./context/UserContext";
import AdminUsersPage from "./pages/adminPages/AdminUsers";
import RestaurantOrders from "./pages/restaurentsPages/orders/RestaurantOrders";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoryItemsPage from "./pages/userPages/Category";
import AddCategory from "./components/adminComponents/Category/AddCategory";
import OrderForRestaurents from "./screens/kitchenScreen/kitchenDashBoard/RestaurentDashboard";
import RestaurentDashboard from "./screens/kitchenScreen/kitchenDashBoard/RestaurentDashboard";
import ForgotPassword from "./components/login/ForgotPassword";
import ResetPassword from "./components/login/ResetPassword";

// Layouts
const UserLayout = lazy(() => import("./layouts/UserLayout"));
const RestaurentLayout = lazy(() => import("./layouts/RestaurantLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));

// Admin Pages
const DashboardPage = lazy(() => import("./pages/adminPages/AdminDashboard"));
const OrdersPage = lazy(() => import("./pages/adminPages/OrdersPage"));
const AdminRestaurantsPage = lazy(() =>
  import("./pages/adminPages/AdminRestaurantsPage")
);
const DeliveryPartnersPage = lazy(() =>
  import("./pages/adminPages/DeliveryPartnersPage")
);
const AnalyticsPage = lazy(() => import("./pages/adminPages/AnalyticsPage"));
const SettingsPage = lazy(() => import("./pages/adminPages/SettingsPage"));

// User Pages
const Homepage = lazy(() => import("./HomePage"));
const RestaurantsPageLists = lazy(() =>
  import("./components/RestaurentsList/RestaurentsLists")
);
const RestaurantList = lazy(() =>
  import("./components/mainHome/RestaurentsDetails")
);
const RestaurantPage = lazy(() =>
  import("./pages/restaurentsPages/RestaurantPage")
);
const SearchPage = lazy(() => import("./components/Search/SearchPage"));
const Cart = lazy(() => import("./screens/userScreen/cart/Cart"));
const PlaceOrder = lazy(() =>
  import("./screens/userScreen/placeOrder/PlaceOrder")
);

const PlaceOrder2 = lazy(() =>
  import("./screens/userScreen/placeOrder/PlaceOrder2")
);
const Thanks = lazy(() => import("./components/thanks/thanks"));
const MyAccount = lazy(() => import("./components/MyAccount/Myaccount"));
const OrderHistory = lazy(() =>
  import("./components/orderHistory/OrderHistory")
);

// Auth Pages
const Login = lazy(() => import("./components/login/Login"));
const Signup = lazy(() => import("./components/signUp/Signup"));

// Kitchen Pages
const KitchenDashboard = lazy(() =>
  import("./screens/kitchenScreen/kitchenDashBoard/RestaurentDashboard")
);
const AddItems = lazy(() => import("./screens/kitchenScreen/addItems/AddItem"));
const DeleteItems = lazy(() => import("./components/DeleteItem/DeleteItem"));

// UI Components
const Navbar2 = lazy(() => import("./components/Navbar/Navbar2"));
const NavbarFooter = lazy(() => import("./components/Navbar/BottomNavbar"));
const NotificationButton = lazy(() =>
  import("./components/NotficiopnButton/Button")
);

// Fallback 404
const NotFound = lazy(() => import("./components/404 Page/NotFound"));

// Enhanced Food Delivery Loader
const FoodDeliveryLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Delivery Animation Container */}
      <div className="relative w-full max-w-md h-64 mb-8 overflow-hidden">
        {/* Road */}
        <div className="absolute bottom-10 left-0 right-0 h-2 bg-gray-200 rounded-full"></div>
        <div className="absolute bottom-10 left-0 right-0 h-2 bg-gray-100 rounded-full"></div>

        {/* Delivery Scooter */}
        <div className="absolute bottom-12 left-0 animate-deliveryScooter">
          <div className="relative">
            <svg
              className="w-16 h-16 text-orange-500 transform -scale-x-100"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                clipRule="evenodd"
              />
            </svg>
            <div className="absolute -bottom-1 left-4 w-8 h-3 bg-gray-300 rounded-full"></div>
            <div className="absolute -bottom-1 right-4 w-8 h-3 bg-gray-300 rounded-full"></div>
            <div className="absolute top-2 right-2 w-4 h-4 bg-orange-100 rounded-full border-2 border-orange-300"></div>
          </div>
        </div>

        {/* Floating Food Items */}
        <div className="absolute top-4 left-1/4 animate-bounce">
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-2xl">🍕</span>
          </div>
        </div>
        <div className="absolute top-8 right-1/4 animate-bounce delay-100">
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-2xl">🍔</span>
          </div>
        </div>
        <div className="absolute top-16 left-1/3 animate-bounce delay-200">
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-2xl">🍣</span>
          </div>
        </div>
      </div>

      {/* App Branding */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg mb-3">
          <span className="text-2xl text-white font-bold">CE</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">CraveEats</h1>
      </div>

      {/* Progress Bar */}
      <div className="w-64 bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full animate-progress"></div>
      </div>

      {/* Loading Text */}
      <p className="text-gray-500 text-sm">
        Preparing your food delivery experience...
      </p>

      {/* CSS Animations */}
      <style>{`
        @keyframes deliveryScooter {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(calc(100vw + 100px));
          }
        }
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-deliveryScooter {
          animation: deliveryScooter 3s linear infinite;
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

const App = () => {
  const location = useLocation();
  const { user } = useUserContext();
  const isLoggedIn = !!user;
  const [isLoading, setIsLoading] = useState(true);

  const hideNavAndFooterPaths = ["/admin", "/kitchen"];
  const shouldShowNavAndFooter = !hideNavAndFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    // Simulate loading (replace with actual loading checks)
    const loadApp = async () => {
      // Add your actual loading checks here (auth, data, etc.)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
    };

    loadApp();

    // Welcome toast
    if (!localStorage.getItem("welcomeToastShown")) {
      toast("🛵 Welcome to CraveEats! Hungry? We're on it!", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
        className: "bg-orange-500 text-white",
      });
      localStorage.setItem("welcomeToastShown", "true");
    }
  }, []);

  if (isLoading) {
    return <FoodDeliveryLoader />;
  }

  return (
    <div className="app">
      <Suspense fallback={<FoodDeliveryLoader />}>
        <ErrorBoundary>
          {shouldShowNavAndFooter && <Navbar2 isLoggedIn={isLoggedIn} />}
          {user?.role === "User" && shouldShowNavAndFooter && (
            <NotificationButton />
          )}

          <Routes>
            {/* Public Pages */}
            {/* <Route path="/new" element={<RestaurantsPageLists />} />
            <Route path="/app" element={<DashboardPage />} /> */}

            {/* User layout and routes */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Homepage />} />
              <Route
                path="restaurant/:restaurantName"
                element={<RestaurantPage />}
              />
              <Route path="restaurants/:city" element={<RestaurantList />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="cart" element={<Cart />} />
              <Route path="order" element={<PlaceOrder2 />} />
              <Route
                path="/:location/:categoryName"
                element={<CategoryItemsPage />}
              />
              <Route path="thanks" element={<Thanks />} />
            </Route>

            {/* Protected user routes */}
            <Route
              path="/user"
              element={<ProtectRoute allowedRole="User"></ProtectRoute>}>
              <Route index element={<Homepage />} />
              <Route path="profile" element={<MyAccount />} />
              <Route path="placeorder" element={<PlaceOrder />} />
              <Route path="history" element={<OrderHistory />} />
            </Route>

            {/* Protected kitchen routes */}

            {/* replace restaurents to kitchen because some route problem */}
            <Route element={<ProtectRoute allowedRole="Restaurent" />}>
              <Route path="/kitchen" element={<RestaurentLayout />}>
                <Route index element={<RestaurentDashboard />} />
                <Route path="dashboard" element={<RestaurentDashboard />} />
                <Route path="addItems" element={<AddItems />} />
                <Route path="manageItems" element={<DeleteItems />} />
                <Route path="settings" element={<OrderHistory />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="restaurants" element={<AdminRestaurantsPage />} />
              <Route
                path="delivery-partners"
                element={<DeliveryPartnersPage />}
              />
              <Route path="add-category" element={<AddCategory />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Auth */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {shouldShowNavAndFooter && <NavbarFooter />}
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

export default App;
