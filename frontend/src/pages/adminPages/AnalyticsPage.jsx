import { useState } from "react";
import PerformanceChart from "../../components/adminComponents/analyticsComponents/PerformanceChart";
import SalesAnalytics from "../../components/adminComponents/analyticsComponents/SalesAnalytics";
import RestaurantPerformance from "../../components/adminComponents/restaurentsComponents/RestaurantPerformance";

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("week");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <select
          className="border rounded px-3 py-1"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}>
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          {/* <PerformanceChart timeRange={timeRange} /> */}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <SalesAnalytics timeRange={timeRange} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        {/* <RestaurantPerformance timeRange={timeRange} /> */}
      </div>
    </div>
  );
};

export default AnalyticsPage;
