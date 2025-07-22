import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";

const LocationsSection = () => {
  const navigate = useNavigate();

  const serviceAreas = [
    {
      id: 1,
      name: "Nainital",
      description: "Lakeside deliveries to Tallital & Mallital",
      image:
        "https://static2.tripoto.com/media/filter/tst/img/2175980/TripDocument/1636190404_images_21.jpeg",
    },
    {
      id: 2,
      name: "Kainchi Dham",
      description: "Fruit belt of Kumaon",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8n61ztke8v_fNaWu0p2GYYXg4nFpqZH9STA&s",
    },
    {
      id: 3,
      name: "Sattal",
      description: "Seven lakes region",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl0vfPGyxDGqMASr8g2_zdt7LwKPdamzikGQ&s",
    },
    {
      id: 4,
      name: "Nakuchiyatal",
      description: "Nine-cornered lake area",
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/67/95/56/photo1jpg.jpg?w=1200&h=-1&s=1",
    },
    {
      id: 5,
      name: "Bhimtal",
      description: "Largest lake in the area",
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/b5/20/0d/bhimtal-lake-nainital.jpg?w=1000&h=1000&s=1",
    },
    {
      id: 6,
      name: "Mukteshwar",
      description: "Scenic mountain views",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk7PXfPuEFIe-5fqjP6jsiZCyV_MJJ9G4k3Q&s",
    },
  ];

  const handleRedirect = (location) => {
    navigate(`/restaurants/${location.name.toLowerCase()}`, {
      state: { location },
    });
  };

  return (
    <div className="py-12 px-4 md:px-8 lg:px-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Our Service Areas
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Delivering delicious food across the Kumaon region
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceAreas.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4 bg-white text-orange-600 p-2 rounded-full">
                  <FiMapPin className="text-xl" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {location.name}
                </h3>
                <p className="text-gray-600 mb-4">{location.description}</p>
                <button
                  onClick={() => handleRedirect(location)}
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium">
                  View restaurants
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/locations")}
            className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-full shadow-md transition-colors">
            <FiMapPin className="mr-2" />
            See all service areas
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationsSection;
