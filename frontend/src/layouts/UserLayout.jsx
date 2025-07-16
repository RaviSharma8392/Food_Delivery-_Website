import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Navbar2 from "../components/Navbar/Navbar2";

import Footer from "../components/Footer/Footer";
import useUserContext from "../context/UserContext";

const UserLayout = () => {
  const user = useUserContext();
  return (
    <div>
      {user.user ? <Navbar /> : <Navbar2 />}
      <Outlet />

      <Footer />
    </div>
  );
};

export default UserLayout;
