import React, { lazy, useEffect, Suspense } from "react";
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

// Layouts
const UserLayout = lazy(() => import("./layouts/UserLayout"));
const RestaurentLayout = lazy(() => import("./layouts/RestaurantLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout")); // renamed usage

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
  import("./screens/kitchenScreen/kitchenDashBoard/KitchenDashboard")
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

// Optional Layout for /user protected routes

const App = () => {
  const location = useLocation();
  const { user } = useUserContext();
  const isLoggedIn = !!user;

  const hideNavAndFooterPaths = ["/admin", "/restaurent"];
  const shouldShowNavAndFooter = !hideNavAndFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );
  useEffect(() => {
    const toastShown = localStorage.getItem("welcomeToastShown");
    if (!toastShown) {
      toast.success("🎉 Welcome to CraveEats – Delivering food in Kumaon!", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
      localStorage.setItem("welcomeToastShown", "true");
    }
  }, []);

  return (
    <div className="app">
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <ErrorBoundary>
          {shouldShowNavAndFooter && <Navbar2 isLoggedIn={isLoggedIn} />}
          {user?.role === "User" && shouldShowNavAndFooter && (
            <NotificationButton />
          )}
          <Routes>
            {/* Public Pages */}

            <Route path="/new" element={<RestaurantsPageLists />} />
            <Route path="/app" element={<DashboardPage />} />

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
            <Route
              path="/restaurent"
              element={
                // <ProtectRoute allowedRole="Kitchen">
                <RestaurentLayout />
                // </ProtectRoute>
              }>
              {/* <Route index element={<OrdersPage />} /> */}

              {/* <Route path="/restaurent" element={<KitchenDashboard />} /> */}
              <Route path="orders" element={<RestaurantOrders />} />
              {/* <Route index element={<AddItems />} /> */}
              {/* <Route path="add" element={<AddItems />} />
              <Route path="delete" element={<DeleteItems />} /> */}
            </Route>
            {/* </Route> */}

            <Route
              path="/admin"
              element={
                // <ProtectRoute allowedRole="Admin">
                <AdminLayout />
                // </ProtectRoute>
              }>
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

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {shouldShowNavAndFooter && <NavbarFooter />}
          <ToastContainer /> {/* ✅ Add this here */}
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

export default App;
