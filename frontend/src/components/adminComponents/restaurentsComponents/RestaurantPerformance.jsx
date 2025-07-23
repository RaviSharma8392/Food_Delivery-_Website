import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RestaurantPerformance = ({ timeRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/admin/analytics/restaurants`,
          {
            params: { period: timeRange },
          }
        );

        console.log("Restaurant data:", response);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching restaurant analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (loading)
    return <div className="text-center py-8">Loading restaurant data...</div>;

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Top Performing Restaurants</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, bottom: 20, left: 30, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#8884d8" name="Orders" />
            <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RestaurantPerformance;
