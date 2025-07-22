import { FiEdit2, FiToggleLeft, FiToggleRight, FiTruck } from "react-icons/fi";

const DeliveryPartnerTable = ({ partners, onEdit, onToggleStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Name
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Contact
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Vehicle
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Status
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Rating
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {partners.map((partner) => (
            <tr key={partner._id} className="hover:bg-gray-50">
              <td className="py-4 px-4 font-medium">{partner.name}</td>
              <td className="py-4 px-4 text-sm text-gray-500">
                <div>{partner.phone}</div>
                <div className="text-xs text-gray-400">
                  {partner.email || "No email"}
                </div>
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <FiTruck className="mr-1" />
                  {partner.vehicle} ({partner.vehicleNumber})
                </div>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    partner.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {partner.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">
                    {partner.rating?.toFixed(1) || "N/A"}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(partner)}
                    className="text-blue-600 hover:text-blue-800 p-1">
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => onToggleStatus(partner._id, partner.active)}
                    className="text-gray-600 hover:text-gray-800 p-1">
                    {partner.active ? (
                      <FiToggleRight size={18} className="text-green-500" />
                    ) : (
                      <FiToggleLeft size={18} className="text-red-500" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryPartnerTable;
