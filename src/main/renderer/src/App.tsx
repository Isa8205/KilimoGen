// --- Code splitting: Use React.lazy for all page-level imports (with named exports fix) ---
import { lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom"; // <-- re-add these imports
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Reports = lazy(() => import("./pages/Reports"));
const Deliveries = lazy(() => import("./pages/Deliveries").then(module => ({ default: module.Deliveries })));
const Inventory = lazy(() => import("./pages/Inventory").then(module => ({ default: module.Inventory })));
const Production = lazy(() => import("./pages/Production"));
const Farmers = lazy(() => import("./pages/Farmers").then(module => ({ default: module.Farmers })));
const ClerkLogin = lazy(() => import("./pages/auth/clerks/ClerkLogin"));
const LandingPage = lazy(() => import("./Landing"));
const ClerkRegister = lazy(() => import("./pages/auth/clerks/ClerkRegister"));
const ManagerLogin = lazy(() => import("./pages/auth/management/ManagerLogin"));
const ManagerRegister = lazy(() => import("./pages/auth/management/ManagerRegister"));
const FarmerRegister = lazy(() => import("./pages/FarmerRegister"));
const AdminPanel = lazy(() => import("./pages/admin/AdminPanel"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const Home = lazy(() => import("./layout/Home"));
const FarmerProfile = lazy(() => import("./pages/FarmerProfile"));
const NotificationsPage = lazy(() => import("./pages/Notifications"));
const Advances = lazy(() => import("./pages/Advances"));
const InventoryItemDetail = lazy(() => import("./pages/InventoryItemView"));
const InventoryItemForm = lazy(() => import("./pages/InventoryItemEdit"));
const CoffeeProduction = lazy(() => import("./pages/Production"));
// --- End code splitting changes ---
import { useRecoilState } from "recoil";
import { sessionState, settingsState } from "./store/store";
import { AppSettings } from "./types/appSettings";

const defaultSettings: AppSettings = {
  general: {
    theme: "dark",
  },
  farm: {
    currentSeason: "",
    currentHarvest: "",
  },
  printing: {
    defaultReceiptPrinter: "",
    defaultReportPrinter: "",
  },
}
function App() {
  const [settings, setSettings] = useRecoilState(settingsState);
  const setSessionData = useRecoilState(sessionState)[1];

  // Get settings from localStorage and load it to recoil state
  useEffect(() => {
    setSettings(defaultSettings);
    (async () => {
      const userSettings = await window.electron.invoke("get-settings");
      setSettings(userSettings);
    })();
  }, []);

  // Ensure to sync the settings with the backend
  useEffect(() => {
    (async () => {
      await window.electron.invoke("set-settings", settings);
    })();
  }, [settings]);

  // Get current session if any
  useEffect(() => {
    (async () => {
      const response = await window.electron.invoke("check-session");
      if (response.user) {
        setSessionData(response.user);
      }
    })();
  }, []);

  return (
    <div>
      <div className="relative h-[100vh] overflow-auto bg-background">
        {/* --- Wrap routes in Suspense for lazy loading --- */}
          <Routes>
            {/* Manager admin panel */}
            <Route path="/admin">
              <Route path="" element={<AdminPanel />} />
            </Route>

            {/* Landing Page Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Routes */}
            <Route path="/auth">
              {/* Clerk Authentication */}
              <Route path="clerk">
                <Route path="login" element={<ClerkLogin />} />
                <Route path="register" element={<ClerkRegister />} />
              </Route>

              {/* Manager Authentication */}
              <Route path="manager">
                <Route path="login" element={<ManagerLogin />} />
                <Route path="register" element={<ManagerRegister />} />
              </Route>

              {/* Password Management */}
              <Route
                path="forgot-password"
                element={<div>Forgot Password</div>}
              />
              <Route path="reset-password" element={<div>Reset Password</div>} />
            </Route>

            {/* Main Application Routes */}
            <Route path="/home" element={<Home />}>
              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />

              {/* Members Management */}
              <Route path="farmers">
                <Route path="" element={<Farmers />} />
                <Route path="add" element={<FarmerRegister />} />
                <Route path="edit/:id" element={<div>Edit Member Form</div>} />
                <Route path=":id" element={<FarmerProfile />} />
              </Route>

              {/* Production */}
              <Route path="production" element={<Production />} />

              {/* Deliveries */}
              <Route path="deliveries" element={<Deliveries />} />

              {/* Inventory Management */}
              <Route path="inventory">
                <Route path="" Component={Inventory} />
                <Route path="add" Component={InventoryItemForm} />
                <Route path="edit/:id" element={<InventoryItemForm />} />
                <Route path=":id" element={<InventoryItemDetail />} />
              </Route>

              {/* Reports */}
              <Route path="reports" element={<Reports />} />

              {/* Advances */}
              <Route path="advances" element={<Advances />} />

              {/* Messaging */}
              <Route path="production" element={<CoffeeProduction />} />

              {/* Settings  */}
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="/notifications" element={<NotificationsPage />} />

            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        {/* --- End Suspense wrapper --- */}
      </div>
    </div>
  );
}

export default App;
