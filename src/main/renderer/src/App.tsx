import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import { Deliveries } from "./pages/Deliveries";
import { Inventory } from "./pages/Inventory";
import Messaging from "./pages/Messaging";
import Production from "./pages/Production";
import { Farmers } from "./pages/Farmers";
import ClerkLogin from "./pages/auth/clerks/ClerkLogin";
import LandingPage from "./Landing";
import ClerkRegister from "./pages/auth/clerks/ClerkRegister";
import ManagerLogin from "./pages/auth/management/ManagerLogin";
import ManagerRegister from "./pages/auth/management/ManagerRegister";
import FarmerRegister from "./pages/FarmerRegister";
import AdminPanel from "./pages/admin/AdminPanel";
import { InventoryForm } from "./pages/InventoryAdd";
import SettingsPage from "./pages/Settings";
import { useRecoilState } from "recoil";
import { sessionState, settingsState } from "./store/store";
import Home from "./layout/Home";
import FarmerProfile from "./pages/FarmerProfile";
import { AppSettings } from "./types/appSettings";
import TitleBar from "./layout/Titlebar";

function App() {
  const [settings, setSettings] = useRecoilState(settingsState)
  const setSessionData = useRecoilState(sessionState)[1];

  useEffect(() => {
    (async () => {
      const response = await window.electron.invoke("check-session");
      if (response.user) {
        setSessionData(response.user);
      }
    })()
  }, []);

  return (
    <div>
      <TitleBar/>
    <div className="relative ">
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
          <Route path="forgot-password" element={<div>Forgot Password</div>} />
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
            <Route path=":id" element={<FarmerProfile/>} />
          </Route>

          {/* Production */}
          <Route path="production" element={<Production />} />

          {/* Deliveries */}
          <Route path="deliveries" element={<Deliveries />} />

          {/* Inventory Management */}
          <Route path="inventory">
            <Route path="" Component={Inventory} />
            <Route path="add" Component={InventoryForm} />
            <Route path="edit/:id" element={<div>Edit Inventory Form</div>} />
            <Route path=":id" element={<div>View Inventory Details</div>} />
          </Route>

          {/* Reports */}
          <Route path="reports" element={<Reports />} />

          {/* Messaging */}
          <Route path="messaging" element={<Messaging />} />

          {/* Settings  */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/settings" element={<SettingsPage/>} />
      </Routes>
    </div>

    </div>
  );
}

export default App;
