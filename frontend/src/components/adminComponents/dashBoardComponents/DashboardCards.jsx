// DashboardCards.jsx
const DashboardCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500">Total Orders</h3>
        <p className="text-2xl font-bold">{stats.totalOrders}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500">Pending Orders</h3>
        <p className="text-2xl font-bold text-yellow-600">
          {stats.pendingOrders}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500">Completed Orders</h3>
        <p className="text-2xl font-bold text-green-600">
          {stats.completedOrders}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500">Active Restaurants</h3>
        <p className="text-2xl font-bold">{stats.activeRestaurants}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500">Delivery Partners</h3>
        <p className="text-2xl font-bold">{stats.deliveryPartners}</p>
      </div>
    </div>
  );
};

export default DashboardCards;
