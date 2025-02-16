import {
  BellIcon,
  ChevronLeft,
  DoorOpen,
  FileTextIcon,
  LayoutDashboard,
  MessageSquareShare,
  Settings,
  Store,
  Truck,
  User,
} from 'lucide-react';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Routes, Route, NavLink, Outlet } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import { Deliveries } from './components/Deliveries';
import { Inventory } from './components/Inventory';
import { Messaging } from './components/Messaging';
import { motion } from 'framer-motion';
import Production from './components/Production';
import { Farmers } from './components/Farmers';
import ClerkLogin from './components/auth/clerks/ClerkLogin';
import LandingPage from './Landing';
import ClerkRegister from './components/auth/clerks/ClerkRegister';
import ManagerLogin from './components/auth/management/ManagerLogin';
import ManagerRegister from './components/auth/management/ManagerRegister';
import FarmerRegister from './components/FarmerRegister';
import AdminPanel from './components/AdminPanel';
import { InventoryForm } from './components/InventoryAdd';
import Tooltip from './components/Widgets/Tooltips/Tooltip';

function App() {
  // The active tab
  const [activeTab, setActiveTab] = useState('Dashboard');

  const Navbar = () => {
    const [isExpanded, setExpanded] = useState(true);

    const navItems = [
      { icon: <LayoutDashboard />, label: 'Dashboard', route: 'dashboard' },
      { icon: <User />, label: 'Farmers', route: 'farmers' },
      // { icon: <Package />, label: "Production", route: "production" },
      { icon: <Truck />, label: 'Deliveries', route: 'deliveries' },
      { icon: <Store />, label: 'Inventory', route: 'inventory' },
      // { icon: <BarChart />, label: "Analytics", route: "analytics" },
      // { icon: <DollarSign />, label: "Financials", route: "financials" },
      { icon: <FileTextIcon />, label: 'Reports', route: 'reports' },
      { icon: <MessageSquareShare />, label: 'Messaging', route: 'messaging' },
    ];

    return (
      <nav className="navigation flex justify-start flex-col p-3 bg-primary text-white gap-10 relative w-fit">
        <span className="flex gap-1 items-center mt-2">
          <motion.h2
            className="text-3xl text-nowrap"
            animate={{ width: isExpanded ? 'auto' : 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            exit={{ opacity: 0 }}
          >
            KilimoGen&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </motion.h2>

          <span
            className="hover:bg-gray-100 hover:text-black rounded-lg inline-flex items-center px-2 py-2"
            onClick={() => setExpanded((prev) => !prev)}
          >
            <motion.button
              className="inline-flex justify-center"
              animate={{ rotate: isExpanded ? 0 : 180 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <ChevronLeft />
            </motion.button>
          </span>
        </span>

        <div className="mid">
          <ul className="list-none">
            {navItems.map((nav) => (
              <li
                onClick={() => {
                  const currentLocation = location.pathname.toString();
                  currentLocation.includes(nav.route)
                    ? setActiveTab(nav.label)
                    : setActiveTab('');
                }}
                key={nav.label}
                className={`navlink rounded-md mt-1 cursor-pointer hover:opacity-80 w-full ${
                  nav.label === activeTab ? 'bg-teal-800' : ''
                }`}
              >
                <Tooltip text={isExpanded ? '' : nav.label} className=''>
                <NavLink
                  to={nav.route}
                  className="inline-flex py-2 ps-2 gap-2 justify-start items-center"
                >
                  <span>{nav.icon}</span>

                  <motion.p
                    animate={{ opacity: 1, width: isExpanded ? 'auto' : 0 }}
                    className="overflow-hidden text-sm text-center"
                    exit={{ opacity: 0 }}
                    >
                    {nav.label}
                  </motion.p>
                </NavLink>
                    </Tooltip>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-3 right-3 left-3">
          <ul className="list-none">
            <li className="navlink flex gap-2 rounded-sm py-1 cursor-pointer">
              <Tooltip text={isExpanded ? '' : 'Settings'} className=''>
              <Settings />
              </Tooltip>
              <motion.p
                className="overflow-hidden"
                animate={{ opacity: 1, width: isExpanded ? 'auto' : 0 }}
                exit={{ opacity: 0 }}
              >
                Settings
              </motion.p>
            </li>
          </ul>
        </div>
      </nav>
    );
  };

  const Home = () => {
    const profileSettingsRef: MutableRefObject<HTMLSpanElement | null> =
      useRef(null);
    const profileRef: MutableRefObject<HTMLSpanElement | null> = useRef(null);

    useEffect(() => {
      let hideTimeout: NodeJS.Timeout | undefined;

      const handleProfileMouseOver = () => {
        clearTimeout(hideTimeout);
        if (profileSettingsRef.current) {
          profileSettingsRef.current.style.display = 'flex';
        }
      };

      const handleProfileMouseOut = () => {
        hideTimeout = setTimeout(() => {
          if (profileSettingsRef.current) {
            profileSettingsRef.current.style.display = 'none';
          }
        }, 2000);
      };

      const handleSettingsMouseOver = () => {
        clearTimeout(hideTimeout);
      };

      const handleSettingsMouseOut = () => {
        hideTimeout = setTimeout(() => {
          if (profileSettingsRef.current) {
            profileSettingsRef.current.style.display = 'none';
          }
        }, 2000);
      };

      const profileElement = profileRef.current;
      const profileSettingsElement = profileSettingsRef.current;

      if (profileElement && profileSettingsElement) {
        profileElement.addEventListener('mouseover', handleProfileMouseOver);
        profileElement.addEventListener('mouseout', handleProfileMouseOut);
        profileSettingsElement.addEventListener(
          'mouseover',
          handleSettingsMouseOver,
        );
        profileSettingsElement.addEventListener(
          'mouseout',
          handleSettingsMouseOut,
        );
      }

      return () => {
        if (profileElement && profileSettingsElement) {
          profileElement.removeEventListener(
            'mouseover',
            handleProfileMouseOver,
          );
          profileElement.removeEventListener('mouseout', handleProfileMouseOut);
          profileSettingsElement.removeEventListener(
            'mouseover',
            handleSettingsMouseOver,
          );
          profileSettingsElement.removeEventListener(
            'mouseout',
            handleSettingsMouseOut,
          );
        }
        if (hideTimeout) clearTimeout(hideTimeout);
        if (hideTimeout) clearTimeout(hideTimeout);
      };
    }, []);

    return (
      <div className="realtive h-screen w-screen flex bg-background">
        <Navbar />

        <section className="content w-full text-white max-h-screen">
          {/* The header of the right section */}
          <div className="flex justify-between items-center bg-white text-black p-2 sticky top-0 left-0 right-0 shadow-md">
            <span>
              <input
                type="text"
                name="search"
                id="search"
                className="ml-4 px-2 py-1 bg-gray-200 rounded-md placeholder:text-gray-400"
                placeholder="Search"
              />
            </span>

            <div className=" relative  flex gap-4 items-center">
              <div className="relative bg-gray-300 p-1 rounded-md hover:opacity-85 cursor-pointer">
                <BellIcon className="text-sm" fill="gray" stroke="gray" />
                <span className="text-xs bg-red-500 text-white py-1 px-1 rounded-full absolute top-1 right-2"></span>
              </div>

              <span ref={profileRef} className="inline-flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                  alt="Not found"
                  className="h-8 w-8 object-cover rounded-md"
                />

                <span
                  ref={profileSettingsRef}
                  className="fixed right-2 top-12 shadow-md flex-col bg-teal-700 hidden"
                >
                  <button className="py-2 px-1 inline-flex gap-2 text-white border-x-2 border border-b-1">
                    <User />
                    Profile
                  </button>
                  <button className="py-2 px-1 inline-flex gap-2 text-white border-x-2 hover:text-red-500">
                    <DoorOpen />
                    Log out
                  </button>
                </span>
              </span>
            </div>
          </div>

          {/* Outlet for rendering nested routes */}
          <div className="mt-0 p-4 rounded-lg">
            <Outlet />
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="relative">
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
            <Route path=":id" element={<div>View Member Details</div>} />
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
        </Route>
      </Routes>
    </div>
  );
}

export default App;
