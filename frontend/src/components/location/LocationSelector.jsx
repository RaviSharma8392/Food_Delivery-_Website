import React, { useState } from "react";
import { FiMapPin, FiCheck, FiX } from "react-icons/fi";

const LocationModal = ({ onClose }) => {
  const cities = ["Bhimtal", "Naukuchiatal"];
  const [selectedCity, setSelectedCity] = useState("");

  const handleConfirm = () => {
    if (selectedCity && typeof onClose === "function") {
      onClose(selectedCity); // Pass back selected city
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xs rounded-xl shadow-lg overflow-hidden animate-popIn">
        {/* Header */}
        <div className="relative p-4 border-b border-gray-100 flex items-center">
          <FiMapPin className="text-orange-500 mr-2" />
          <h3 className="font-medium text-gray-800">Select Your Location</h3>
          <button
            onClick={() => onClose && onClose()}
            className="ml-auto text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>

        {/* City List */}
        <div className="divide-y divide-gray-100">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`w-full px-4 py-3 text-left flex items-center justify-between ${
                selectedCity === city
                  ? "bg-orange-50 text-orange-600"
                  : "hover:bg-gray-50"
              }`}>
              <span>{city}</span>
              {selectedCity === city && <FiCheck className="text-orange-500" />}
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        <div className="p-4 bg-gray-50 text-center">
          <button
            onClick={handleConfirm}
            disabled={!selectedCity}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full w-full disabled:opacity-50">
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
