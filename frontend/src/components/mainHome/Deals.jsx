import React from "react";
import { FiTag, FiTruck, FiGift } from "react-icons/fi";

const Deals = () => {
  const deals = [
    {
      id: 1,
      title: "Flat 20% Off",
      description: "Get 20% off on your first order above ₹300",
      code: "CRAVE20",
      bgColor: "bg-gradient-to-br from-yellow-100 to-yellow-50",
      icon: <FiTag className="w-6 h-6 text-yellow-600" />,
      borderColor: "border-yellow-200",
    },
    {
      id: 2,
      title: "Free Delivery",
      description: "Free delivery on orders above ₹199",
      code: "FREESHIP",
      bgColor: "bg-gradient-to-br from-red-100 to-red-50",
      icon: <FiTruck className="w-6 h-6 text-red-600" />,
      borderColor: "border-red-200",
    },
    {
      id: 3,
      title: "Combo Offer",
      description: "Buy 1 Get 1 Free on selected items",
      code: "BOGO",
      bgColor: "bg-gradient-to-br from-green-100 to-green-50",
      icon: <FiGift className="w-6 h-6 text-green-600" />,
      borderColor: "border-green-200",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">
            <span className="text-orange-500">Exclusive</span> Deals & Offers
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
            Limited time offers you don't want to miss
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className={`${deal.bgColor} rounded-xl p-6 border ${deal.borderColor} shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${deal.bgColor} mr-4`}>
                  {deal.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {deal.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{deal.description}</p>
                  <div className="bg-white px-4 py-2 rounded-lg inline-flex items-center border border-gray-200">
                    <span className="text-sm font-medium text-gray-500 mr-2">
                      Use code:
                    </span>
                    <span className="font-bold text-gray-800">{deal.code}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(deal.code)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      aria-label="Copy code">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button className="px-6 py-2 border-2 border-orange-500 text-orange-500 font-medium rounded-full hover:bg-orange-500 hover:text-white transition-colors duration-300">
            View All Offers
          </button>
        </div>
      </div>
    </section>
  );
};

export default Deals;
