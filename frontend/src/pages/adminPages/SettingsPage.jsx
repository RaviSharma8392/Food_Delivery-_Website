import { useState, useEffect } from "react";
import { FiSave } from "react-icons/fi";
import { saveSettings, getSettings } from "../../services/admin/settingsApi";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    platformName: "",
    commissionRate: 0,
    deliveryFee: 0,
    notificationEnabled: false,
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveSettings(settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform Name
            </label>
            <input
              type="text"
              name="platformName"
              value={settings.platformName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commission Rate (%)
            </label>
            <input
              type="number"
              name="commissionRate"
              value={settings.commissionRate}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Delivery Fee (₹)
            </label>
            <input
              type="number"
              name="deliveryFee"
              value={settings.deliveryFee}
              onChange={handleChange}
              min="0"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="notificationEnabled"
              name="notificationEnabled"
              checked={settings.notificationEnabled}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="notificationEnabled"
              className="ml-2 block text-sm text-gray-700">
              Enable Email Notifications
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="maintenanceMode"
              className="ml-2 block text-sm text-gray-700">
              Maintenance Mode
            </label>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <FiSave className="mr-2" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
