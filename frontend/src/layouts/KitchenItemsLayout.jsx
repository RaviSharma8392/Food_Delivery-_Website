import React from "react";
import { Outlet } from "react-router-dom";
import ItemNavbar from "../components/ManageItemNavbar/AddItemsNavbar";
// import ItemNavbar from "../../components/ManageItemNavbar/AddItemsNavbar";

export default function KitchenItemsLayout() {
  return (
    <>
      <ItemNavbar />
      <Outlet />
    </>
  );
}
