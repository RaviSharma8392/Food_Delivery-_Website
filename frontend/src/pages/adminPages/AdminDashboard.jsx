import { useState, useEffect } from "react";

import {
  getOrderStats,
  getRestaurantStats,
  getDeliveryPartnerStats,
} from "../../services/admin/dashboardService";

import DashboardCards from "../../components/adminComponents/dashBoardComponents/DashboardCards";
import RecentOrders from "../../components/adminComponents/orderComponents/RecentOrders";
import RestaurantStatus from "../../components/adminComponents/restaurentsComponents/RestaurantStatus";
import PerformanceChart from "../../components/adminComponents/analyticsComponents/PerformanceChart";

const AdminDashBoard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    activeRestaurants: 0,
    deliveryPartners: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [orders, restaurants, partners] = await Promise.all([
          getOrderStats(),
          getRestaurantStats(),
          getDeliveryPartnerStats(),
        ]);

        setStats({
          totalOrders: orders.total || 0,
          pendingOrders: orders.pending || 0,
          completedOrders: orders.completed || 0,
          activeRestaurants: restaurants.active || 0,
          deliveryPartners: partners.active || 0,
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 ">
      <h1 className="text-2xl font-bold">Delivery System Dashboard</h1>

      <DashboardCards stats={stats} />
      <RestaurantStatus />

      <div className="grid  gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
      </div>

      <RecentOrders />
    </div>
  );
};

export default AdminDashBoard;
