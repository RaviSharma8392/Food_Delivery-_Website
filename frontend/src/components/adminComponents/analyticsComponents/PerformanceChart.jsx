import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FiTrendingUp, FiClock, FiCheckCircle, FiTruck } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getPerformanceAnalytics } from "../../../services/admin/adminAnalyticsAPI"; // Adjust path as needed

const PerformanceChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("week");
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState({
    timeline: [],
    orderStatus: [],
    deliveryMetrics: {},
    topRestaurants: [],
  });

  const statusColors = {
    pending: "#F59E0B",
    preparing: "#3B82F6",
    out_for_delivery: "#8B5CF6",
    delivered: "#10B981",
    cancelled: "#EF4444",
  };

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPerformanceAnalytics(timeRange, startDate, endDate);
      console.log("Sales analytics data:", data);

      setChartData({
        timeline: data.timeline || [],
        orderStatus: data.orderStatus || [],
        deliveryMetrics: data.deliveryMetrics || {},
        topRestaurants: data.topRestaurants || [],
      });
    } catch (err) {
      console.error("Error fetching performance data:", err);
      setError("Failed to load performance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange, startDate, endDate]);

  const renderChart = () => {
    if (loading)
      return <div className="text-center py-8">Loading charts...</div>;
    if (error)
      return <div className="text-center py-8 text-red-500">{error}</div>;

    // Prepare delivery times data for the bar chart
    const deliveryTimesData = chartData.deliveryMetrics
      ? [
          {
            timeRange: "Avg",
            count: chartData.deliveryMetrics.avgDeliveryTime || 0,
          },
          {
            timeRange: "Fastest",
            count: chartData.deliveryMetrics.fastestDelivery || 0,
          },
          {
            timeRange: "Slowest",
            count: chartData.deliveryMetrics.slowestDelivery || 0,
          },
        ]
      : [];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Orders */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center">
              <FiTrendingUp className="mr-2" /> Daily Orders
            </h3>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}>
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {timeRange === "custom" && (
            <div className="flex space-x-2 mb-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="border rounded px-2 py-1 text-sm"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
          )}

          <div className="h-64">
            {chartData.timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orderCount"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Total Orders"
                  />
                  <Line
                    type="monotone"
                    dataKey="completedOrders"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Delivered"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-gray-500">
                No order data available
              </p>
            )}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold flex items-center mb-4">
            <FiClock className="mr-2" /> Order Status
          </h3>
          <div className="h-64">
            {chartData.orderStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.orderStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="status"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }>
                    {chartData.orderStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={statusColors[entry.status] || "#ccc"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-gray-500">
                No order status data
              </p>
            )}
          </div>
        </div>

        {/* Delivery Times */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold flex items-center mb-4">
            <FiTruck className="mr-2" /> Delivery Performance
          </h3>
          <div className="h-64">
            {deliveryTimesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveryTimesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timeRange" />
                  <YAxis
                    label={{
                      value: "Minutes",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="Delivery Time (min)"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-gray-500">
                No delivery data available
              </p>
            )}
          </div>
        </div>

        {/* Top Restaurants */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold flex items-center mb-4">
            <FiCheckCircle className="mr-2" /> Top Restaurants
          </h3>
          <div className="h-64">
            {chartData.topRestaurants.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.topRestaurants}
                  layout="vertical"
                  margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="restaurantName"
                    type="category"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="orderCount"
                    name="Orders"
                    fill="#3B82F6"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-gray-500">
                No restaurant data available
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Performance Analytics</h2>
      </div>
      <div className="p-4">{renderChart()}</div>
    </div>
  );
};

export default PerformanceChart;
