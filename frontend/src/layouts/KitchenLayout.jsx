import React from "react";
// import ItemNavbar from "../components/ManageItemNavbar/AddItemsNavbar";
import { Outlet } from "react-router-dom";
import ItemNavbar from "../components/ManageItemNavbar/AddItemsNavbar";

const KitchenLayout = () => {
  return (
    <div>
      <ItemNavbar />
      <Outlet />
    </div>
  );
};
export default KitchenLayout;
