import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import FloatingCartCTA from "./components/cartIcon/CartIcons";
import ProtectRoute from "./protectedRoute/ProtectRoutes";
import NotFound from "./components/404 Page/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const UserLayout = lazy(() => import("./layouts/UserLayout"));
const LoginUserLayout = lazy(() => import("./layouts/LoginUserLayout"));
const KitchenItemsLayout = lazy(() => import("./layouts/KitchenItemsLayout"));

const Home = lazy(() => import("./screens/userScreen/home/Home"));
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

const Login = lazy(() => import("./components/login/Login"));
const Signup = lazy(() => import("./components/signUp/Signup"));

const KitchenDashboard = lazy(() =>
  import("./screens/kitchenScreen/kitchenDashBoard/KitchenDashboard")
);
const AddItems = lazy(() => import("./screens/kitchenScreen/addItems/AddItem"));
const DeleteItems = lazy(() => import("./components/DeleteItem/DeleteItem"));

const AdminDashboard = lazy(() =>
  import("./screens/adminScreen/adminDashboard/AdminDashBoard")
);

const App = () => {
  const location = useLocation();

  const hideCartPaths = ["/admin", "/kitchen"];
  const shouldShowCart = !hideCartPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="app">
      {shouldShowCart && <FloatingCartCTA />}
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary>
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="cart" element={<Cart />} />
              <Route path="order" element={<PlaceOrder2 />} />
              <Route path="thanks" element={<Thanks />} />
            </Route>

            <Route
              path="/user"
              element={
                <ProtectRoute allowedRole="User">
                  <LoginUserLayout />
                </ProtectRoute>
              }>
              <Route index element={<MyAccount />} />
              <Route path="account" element={<MyAccount />} />
              <Route path="placeorder" element={<PlaceOrder />} />
              <Route path="history" element={<OrderHistory />} />
            </Route>

            <Route
              path="/kitchen"
              element={<ProtectRoute allowedRole="Kitchen"></ProtectRoute>}>
              <Route index element={<KitchenDashboard />} />
              <Route path="items" element={<KitchenItemsLayout />}>
                <Route index element={<AddItems />} />
                <Route path="add" element={<AddItems />} />
                <Route path="delete" element={<DeleteItems />} />
              </Route>
            </Route>

            <Route
              path="/admin"
              element={<ProtectRoute allowedRole="Admin"></ProtectRoute>}>
              <Route index element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

export default App;
