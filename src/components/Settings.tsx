import { useState } from "react";
import { ChevronsUpDown, CheckCircle } from "lucide-react";

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="space-y-6 p-10 pb-16" style={{ backgroundColor: "#EFEDE7" }}>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#22331D" }}>
          Settings
        </h2>
        <p className="text-muted-foreground" style={{ color: "#6A6D69" }}>
          Manage your account settings and set e-mail preferences.
        </p>
      </div>

      {/* Account Settings */}
      <div className="rounded-lg border bg-card shadow-sm" style={{ backgroundColor: "#FFFFFF", color: "#22331D" }}>
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Account</h3>
          <p className="text-sm text-muted-foreground" style={{ color: "#6A6D69" }}>
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium leading-none">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Your username"
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              style={{
                backgroundColor: "#EFEDE7",
                borderColor: "#6A6D69",
                color: "#22331D",
              }}
            />
            <p className="text-[0.8rem]" style={{ color: "#6A6D69" }}>
              This is your public display name.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your email"
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              style={{
                backgroundColor: "#EFEDE7",
                borderColor: "#6A6D69",
                color: "#22331D",
              }}
            />
            <p className="text-[0.8rem]" style={{ color: "#6A6D69" }}>
              We'll use this email to contact you.
            </p>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="rounded-lg border bg-card shadow-sm" style={{ backgroundColor: "#FFFFFF", color: "#22331D" }}>
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Appearance</h3>
          <p className="text-sm" style={{ color: "#6A6D69" }}>
            Customize the appearance of the app. Automatically switch between day and night themes.
          </p>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <div className="space-y-2">
            <label htmlFor="theme" className="text-sm font-medium leading-none">
              Theme
            </label>
            <select
              id="theme"
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              style={{
                backgroundColor: "#EFEDE7",
                borderColor: "#6A6D69",
                color: "#22331D",
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
            <p className="text-[0.8rem]" style={{ color: "#6A6D69" }}>
              Select the theme for the dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-lg border bg-card shadow-sm" style={{ backgroundColor: "#FFFFFF", color: "#22331D" }}>
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Notifications</h3>
          <p className="text-sm" style={{ color: "#6A6D69" }}>
            Configure how you receive notifications.
          </p>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4" style={{ borderColor: "#6A6D69" }}>
            <div className="space-y-0.5">
              <label htmlFor="notifications" className="font-medium text-base">
                Receive notifications
              </label>
              <p className="text-[0.8rem]" style={{ color: "#6A6D69" }}>
                Receive notifications about your account activity.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notificationsEnabled}
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors ${
                notificationsEnabled ? "bg-accent" : "bg-secondary"
              }`}
              style={{ borderColor: notificationsEnabled ? "#F65A11" : "#6A6D69" }}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-background shadow-lg transition-transform ${
                  notificationsEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="inline-flex items-center gap-2 h-10 px-4 py-2 rounded-md"
        style={{
          backgroundColor: "#F65A11",
          color: "#FFFFFF",
        }}
      >
        <CheckCircle className="h-4 w-4" />
        Save changes
      </button>
    </div>
  );
};

export default SettingsPage;
