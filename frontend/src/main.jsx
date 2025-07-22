import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/StoreContext.jsx"; // ✅ Replace StoreContextProvider
import { UserProvider } from "./context/UserContext.jsx";
import "./index.css";
import { DataProvider } from "./context/cartContext.jsx";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <DataProvider>
        <UserProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </UserProvider>
      </DataProvider>
    </CartProvider>
  </BrowserRouter>
);
