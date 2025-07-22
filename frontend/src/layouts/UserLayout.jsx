import React from "react";
import { Outlet } from "react-router-dom";
import Navbar2 from "../components/Navbar/Navbar2";
import Footer from "../components/Footer/Footer";
import useUserContext from "../context/UserContext";
import NavbarFooter from "../components/Navbar/BottomNavbar";

const UserLayout = () => {
  const user = useUserContext();

  const isLoggedIn = !!user?.user;

  return (
    <div>
      <Navbar2 isLoggedIn={isLoggedIn} />
      <Outlet />
      <Footer />
      <NavbarFooter />
    </div>
  );
};

export default UserLayout;
