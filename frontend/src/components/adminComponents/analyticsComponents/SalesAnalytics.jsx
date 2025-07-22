import { useState, useEffect } from "react";
import axios from "axios";

const COLORS = ["#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#8B5CF6"];

const SalesAnalytics = ({ timeRange = "week" }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:3000/api/v1/admin/analytics/sales",
          { params: { period: timeRange } }
        );
        setAnalytics(res.data);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) return <p>Loading...</p>;
  if (!analytics) return <p>No analytics data available</p>;

  const { orderStatus, timeline, deliveryMetrics, topRestaurants } = analytics;

  const maxOrders = Math.max(...timeline.map((t) => t.orderCount), 1);
  const maxTopSales = Math.max(...topRestaurants.map((r) => r.orderCount), 1);
  const totalStatusCount = orderStatus.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="space-y-8 p-6 bg-white rounded shadow text-gray-800">
      <h2 className="text-2xl font-bold">Sales Analytics</h2>

      {/* Delivery Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["avgDeliveryTime", "fastestDelivery", "slowestDelivery"].map(
          (key) => (
            <div
              key={key}
              className="p-4 bg-gray-50 rounded shadow-sm text-center">
              <p className="text-sm text-gray-500 capitalize">
                {key.replace("Delivery", " Delivery")}
              </p>
              <p className="text-xl font-semibold">
                {deliveryMetrics[key]} mins
              </p>
            </div>
          )
        )}
      </div>

      {/* Order Status */}
      <div>
        <h3 className="font-semibold mb-2">Order Status</h3>
        <div className="space-y-2">
          {orderStatus.map((item, idx) => {
            const percent = ((item.count / totalStatusCount) * 100).toFixed(1);
            return (
              <div key={idx}>
                <div className="flex justify-between text-sm">
                  <span>{item.status}</span>
                  <span>
                    {item.count} ({percent}%)
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded">
                  <div
                    className="h-4 rounded"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: COLORS[idx % COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline (Orders per Day) */}
      <div>
        <h3 className="font-semibold mb-2">Orders Timeline</h3>
        <div className="flex items-end gap-4 h-40 border-b border-gray-200 pb-4">
          {timeline.map((day, idx) => {
            const height = (day.orderCount / maxOrders) * 100;
            return (
              <div key={idx} className="text-center w-full">
                <div
                  className="bg-blue-500 w-full rounded-t"
                  style={{ height: `${height}%` }}
                  title={`${day.orderCount} orders on ${day.date}`}
                />
                <p className="text-xs mt-1 truncate">{day.date.slice(5)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Restaurants */}
      <div>
        <h3 className="font-semibold mb-2">Top Restaurants</h3>
        <div className="space-y-2">
          {topRestaurants.map((res, idx) => {
            const width = (res.orderCount / maxTopSales) * 100;
            return (
              <div key={idx}>
                <div className="flex justify-between text-sm">
                  <span>{res.restaurantName}</span>
                  <span>{res.orderCount} orders</span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded">
                  <div
                    className="h-4 rounded"
                    style={{
                      width: `${width}%`,
                      backgroundColor: COLORS[idx % COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
