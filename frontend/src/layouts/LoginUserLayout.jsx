import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Navbar2 from "../components/Navbar/Navbar2";

import Footer from "../components/Footer/Footer";
import CartIcon from "../components/cartIcon/CartIcons";
import useUserContext from "../context/UserContext";
import { User } from "lucide-react";
import FloatingCartButton from "../components/cartIcon/CartIcons";

const LoginUserLayout = () => {
  const user = useUserContext();
  return (
    <div>
      {user.user ? <Navbar /> : <Navbar2 />}
      <Outlet />
      <FloatingCartButton />
      <Footer />
    </div>
  );
};

export default LoginUserLayout;
