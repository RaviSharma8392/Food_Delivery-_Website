// src/components/NotificationButton.jsx
import { requestNotificationPermission } from "../../Service/notificationService";

export default function NotificationButton() {
  const handleClick = async () => {
    try {
      await requestNotificationPermission();
      alert("Notifications enabled!");
    } catch (err) {
      console.error("Notification error", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md z-50">
      🔔 Enable Notifications
    </button>
  );
}
