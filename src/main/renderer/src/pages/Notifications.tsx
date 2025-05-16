import { useState, useMemo, useEffect } from "react";
import { Bell, Check, Filter, RefreshCcw, Trash2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Type definition based on the provided data structure
type Notification = {
  id: number;
  title: string;
  category: string;
  message: string;
  date: Date;
  seen: boolean;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const fetchNotifications = async () => {
    const response = await window.electron.invoke("get-notifications");

    try {
      setNotifications(response.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    notifications.forEach((notification) =>
      uniqueCategories.add(notification.category)
    );
    return Array.from(uniqueCategories);
  }, [notifications]);

  // Filter notifications based on selected category
  const filteredNotifications = useMemo(() => {
    if (!selectedCategory) return notifications;
    return notifications.filter(
      (notification) => notification.category === selectedCategory
    );
  }, [notifications, selectedCategory]);

  // Count of unread notifications
  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.seen).length;
  }, [notifications]);

  // Mark a notification as read
  const markAsRead = async (id: number) => {
    await window.electron.invoke("notification:mark-as-read", id);
    fetchNotifications();
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    notifications.forEach(async (notification) => {
      if (!notification.seen) {
        await window.electron.invoke(
          "notification:mark-as-read",
          notification.id
        );
      }
    });

    fetchNotifications();
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setSelectedCategory(null);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Bell className="text-orange-500 mr-2" size={20} />
            <h1 className="text-xl font-semibold text-gray-800">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="ml-2 bg-orange-500 text-white text-xs font-medium rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center">
            {/* Filter button */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full mr-2 flex items-center"
              >
                <Filter size={18} />
              </button>

              {/* Filter dropdown */}
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setShowFilterMenu(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        !selectedCategory
                          ? "bg-orange-50 text-orange-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      All notifications
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowFilterMenu(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm capitalize ${
                          selectedCategory === category
                            ? "bg-orange-50 text-orange-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Read all button */}
            <button
              onClick={markAllAsRead}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full mr-2"
              title="Mark all as read"
            >
              <Check size={18} />
            </button>

            {/* Clear all button */}
            <button
              onClick={clearAllNotifications}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              title="Clear all notifications"
            >
              <Trash2 size={18} />
            </button>

            {/* Refresh the notifications */}
            <button
              title="Refresh"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={fetchNotifications}
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>

        {/* Filter indicator */}
        {selectedCategory && (
          <div className="px-4 py-2 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Filtered by: </span>
              <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-sm capitalize">
                {selectedCategory}
              </span>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Notifications list */}
        {filteredNotifications.length > 0 ? (
          <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
            {filteredNotifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 transition-colors hover:bg-gray-50 ${
                  !notification.seen ? "bg-orange-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          !notification.seen ? "bg-orange-500" : "bg-gray-200"
                        }`}
                      ></span>
                      <p
                        className={`text-sm font-medium ${
                          !notification.seen ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                        {notification.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(notification.date, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {!notification.seen && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-orange-600 hover:text-orange-800 p-1 rounded-full hover:bg-orange-50"
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 px-4 text-center">
            <Bell className="text-gray-300 w-12 h-12 mx-auto mb-3" />
            <h3 className="text-gray-500 text-lg font-medium mb-1">
              No notifications
            </h3>
            <p className="text-gray-400 text-sm">
              {selectedCategory
                ? `No ${selectedCategory} notifications found`
                : "You're all caught up!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
