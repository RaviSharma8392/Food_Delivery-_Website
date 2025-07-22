import React, { useEffect, Suspense, lazy, useState } from "react";
import { toast } from "react-toastify";
import CategoryList from "./components/category/Category";
import TopRestaurantsBhimtal from "./components/homepageAttraction/TopResto";
import MobileHeroBanner from "./components/homepageAttraction/mobileBanner/MobileBanner";
import LocationModal from "./components/location/LocationSelector";
import { useNavigate } from "react-router-dom";
import RestaurantList from "./components/mainHome/RestaurentsDetails";

const HeroBanner = lazy(() => import("./components/mainHome/HeroBanner"));
const WhyChooseUs = lazy(() => import("./components/mainHome/WhyChooseUs"));
const PopularRestaurants = lazy(() =>
  import("./components/mainHome/PopularRestaurants")
);
const Deals = lazy(() => import("./components/mainHome/Deals"));
const HowItWorks = lazy(() => import("./components/mainHome/HowItWorks"));
const LocationsSection = lazy(() =>
  import("./components/mainHome/ServiceArea")
); // ✅ correct path

const Homepage = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedCity = localStorage.getItem("userCity");

    const toastTimer = setTimeout(() => {
      const toastShown = localStorage.getItem("welcomeToastShown");
      if (!toastShown) {
        toast.success(
          "🍽️ Welcome to SavoryBites – Bhimtal's local food delivery!",
          {
            position: "top-center",
            autoClose: 5000,
            theme: "colored",
          }
        );
        localStorage.setItem("welcomeToastShown", "true");
      }
    }, 1000);

    const modalTimer = setTimeout(() => {
      if (!savedCity) {
        setShowModal(true);
      }
    }, 10000);

    return () => {
      clearTimeout(toastTimer);
      clearTimeout(modalTimer);
    };
  }, []);

  const navigate = useNavigate();

  const handleModalClose = (selectedCity = null) => {
    if (selectedCity) {
      const citySlug = selectedCity.toLowerCase(); // Convert to lowercase slug
      localStorage.setItem("userCity", citySlug);

      toast.success(`Location set to ${selectedCity}`, {
        position: "top-center",
        autoClose: 3000,
      });

      setShowModal(false); // Close the modal
      // navigate(`/${citySlug}/restaurants`); // ✅ Redirect after confirm
    } else {
      setShowModal(false); // Just close if no city selected
    }
  };

  return (
    <div className="bg-[#fff8f1] min-h-screen">
      {showModal && <LocationModal onClose={handleModalClose} />}

      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <HeroBanner />
        <MobileHeroBanner />
        {/* <CategoryList /> */}
        <RestaurantList /> <WhyChooseUs />
        <Deals />
        <LocationsSection />
        <PopularRestaurants />
        <HowItWorks />
      </Suspense>
    </div>
  );
};

export default Homepage;
