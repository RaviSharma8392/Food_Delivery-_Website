import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import { Helmet } from "react-helmet-async";
import { getRestaurantBySlug } from "../../services/admin/restaurantApi";

const decodeSlug = (slug) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const RestaurantPage = () => {
  const { restaurantName } = useParams();
  const { state } = useLocation();
  const [restaurant, setRestaurant] = useState(state?.restaurant || null);

  const decodedName = decodeSlug(restaurantName);

  // Get location from localStorage or default to "bhimtal"
  const userLocation =
    localStorage.getItem("user_location")?.toLowerCase() || "bhimtal";

  useEffect(() => {
    if (!restaurant) {
      const fetchRestaurant = async () => {
        try {
          const res = await getRestaurantBySlug(restaurantName, userLocation);
          setRestaurant(res);
        } catch (err) {
          console.error("❌ Failed to load restaurant:", err);
        }
      };

      fetchRestaurant();
    }
  }, [restaurant, restaurantName, userLocation]);

  return (
    <>
      <Helmet>
        <title>{decodedName} | Order Online | TasteKumaon</title>
        <meta
          name="description"
          content={`Order delicious food online from ${decodedName}. Fast delivery and traditional Kumaoni dishes.`}
        />
        <link
          rel="canonical"
          href={`https://tastekumaon.com/restaurant/${restaurantName}`}
        />
      </Helmet>

      {restaurant ? (
        <FoodDisplay restaurantId={restaurant._id} />
      ) : (
        <div className="p-10 text-center text-lg font-semibold">
          Loading restaurant...
        </div>
      )}
    </>
  );
};

export default RestaurantPage;
