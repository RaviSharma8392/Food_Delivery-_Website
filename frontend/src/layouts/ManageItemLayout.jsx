import React from "react";
import Navbar from "../components/components/AddItemsNavbar";
import { Outlet } from "react-router-dom";

const AddItemLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AddItemLayout;
