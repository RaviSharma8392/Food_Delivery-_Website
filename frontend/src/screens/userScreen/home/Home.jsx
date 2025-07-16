import { useState } from "react";
import Header from "../../../components/Header/Header";
import FoodDisplay from "../../../components/FoodDisplay/FoodDisplay";

const Home = () => {
  return (
    <div>
      <Header />

      <FoodDisplay />
    </div>
  );
};

export default Home;
