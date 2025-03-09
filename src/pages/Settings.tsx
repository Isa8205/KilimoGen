import { useEffect, useState } from "react";
import { CheckCircle, Edit2, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { ipcRenderer } from "electron";

const SettingsPage = () => {
  const [userSettings, setUserSettings] = useState<{ [key: string]: any }>({});
  const [printers, setPrinters] = useState<
    { name: string; displayName: string; description: string; printerId: string }[]
  >([]);
  const [editPrinter, setEditPrinter] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem("userSettings");
    if (storedSettings) {
      setUserSettings(JSON.parse(storedSettings));
    } else {
      localStorage.setItem("userSettings", JSON.stringify({}));
    }
  }, []);

  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        const printers = await ipcRenderer.invoke("getPrinters");
        setPrinters(printers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrinters();
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setUserSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveUserSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(userSettings));
    setHasChanges(false);
  };

  return (
    <div className="space-y-6 p-10 pb-16 bg-[#EFEDE7] min-h-screen">
      <h2 className="text-2xl font-bold text-[#22331D]">Settings</h2>
      <p className="text-sm text-[#6A6D69]">Manage your factory management system settings.</p>

      {/* Printer Settings */}
      <div className="rounded-lg border bg-white shadow p-6">
        <h3 className="text-xl font-semibold text-[#22331D]">Printer</h3>
        <p className="text-sm text-[#6A6D69] mb-4">Set your default printer.</p>

        <div className="flex items-center justify-between border p-3 rounded-md bg-[#EFEDE7]">
          <p className="text-sm text-[#22331D]">
            Default Printer: {userSettings.defaultPrinter || "Not set"}
          </p>
          <button onClick={() => setEditPrinter(!editPrinter)}>
            <Edit2 size={16} className="text-[#F65A11]" />
          </button>
        </div>

        {editPrinter && (
          <select
            onChange={(e) => handleSettingChange("defaultPrinter", e.target.value)}
            className="mt-3 block w-full rounded-md border border-[#6A6D69] bg-white p-2 text-sm text-[#22331D]"
          >
            {printers.length ? (
              printers.map((printer, i) => (
                <option key={i} value={printer.displayName}>
                  {printer.displayName}
                </option>
              ))
            ) : (
              <option>No printers found</option>
            )}
          </select>
        )}
      </div>

      {/* Machine Settings */}
      <div className="rounded-lg border bg-white shadow p-6">
        <h3 className="text-xl font-semibold text-[#22331D]">Machinery Alerts</h3>
        <p className="text-sm text-[#6A6D69] mb-4">Receive alerts for maintenance or faults.</p>

        <div className="flex items-center justify-between p-3 border rounded-md bg-[#EFEDE7]">
          <p className="text-sm text-[#22331D]">Enable Alerts</p>
          <button onClick={() => handleSettingChange("machineAlerts", !userSettings.machineAlerts)}>
            {userSettings.machineAlerts ? (
              <ToggleRight size={24} className="text-[#F65A11]" />
            ) : (
              <ToggleLeft size={24} className="text-[#6A6D69]" />
            )}
          </button>
        </div>
      </div>

      {/* Environment Monitoring */}
      <div className="rounded-lg border bg-white shadow p-6">
        <h3 className="text-xl font-semibold text-[#22331D]">Temperature Monitoring</h3>
        <p className="text-sm text-[#6A6D69] mb-4">Enable alerts for extreme factory conditions.</p>

        <div className="flex items-center justify-between p-3 border rounded-md bg-[#EFEDE7]">
          <p className="text-sm text-[#22331D]">Receive alerts for extreme temperatures</p>
          <button onClick={() => handleSettingChange("tempAlerts", !userSettings.tempAlerts)}>
            {userSettings.tempAlerts ? (
              <ToggleRight size={24} className="text-[#F65A11]" />
            ) : (
              <ToggleLeft size={24} className="text-[#6A6D69]" />
            )}
          </button>
        </div>
      </div>

      {/* User Access Control */}
      <div className="rounded-lg border bg-white shadow p-6">
        <h3 className="text-xl font-semibold text-[#22331D]">User Permissions</h3>
        <p className="text-sm text-[#6A6D69] mb-4">Manage admin and operator access.</p>

        <select
          onChange={(e) => handleSettingChange("userRole", e.target.value)}
          className="mt-1 block w-full rounded-md border border-[#6A6D69] bg-white p-2 text-sm text-[#22331D]"
        >
          <option value="operator">Operator</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="rounded-lg border bg-white shadow p-6">
        <h3 className="text-xl font-semibold text-[#22331D]">Notifications</h3>
        <p className="text-sm text-[#6A6D69] mb-4">Configure notification preferences.</p>

        <div className="flex items-center justify-between p-3 border rounded-md bg-[#EFEDE7]">
          <p className="text-sm text-[#22331D]">Receive Notifications</p>
          <button onClick={() => handleSettingChange("notifications", !userSettings.notifications)}>
            {userSettings.notifications ? (
              <ToggleRight size={24} className="text-[#F65A11]" />
            ) : (
              <ToggleLeft size={24} className="text-[#6A6D69]" />
            )}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveUserSettings}
        disabled={!hasChanges}
        className={`inline-flex items-center gap-2 h-10 px-5 rounded-md shadow-md transition ${
          hasChanges
            ? "bg-[#F65A11] text-white hover:bg-[#e0550f]"
            : "bg-[#6A6D69] text-gray-300 cursor-not-allowed"
        }`}
      >
        <Save size={16} />
        Save changes
      </button>
    </div>
  );
};

export default SettingsPage;
