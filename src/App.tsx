import {
  BellIcon,
  ChevronLeft,
  DoorOpen,
  FileTextIcon,
  LayoutDashboard,
  LogIn,
  MessageSquareShare,
  Settings,
  Store,
  Truck,
  User,
} from 'lucide-react';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
  Routes,
  Route,
  NavLink,
  Outlet,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import { Deliveries } from './components/Deliveries';
import { Inventory } from './components/Inventory';
import { Messaging } from './components/Messaging';
import { AnimatePresence, motion } from 'framer-motion';
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
import SettingsPage from './components/Settings';
import axios from 'axios';
import notify from './components/Widgets/ToastHelper';
import { ToastContainer } from 'react-toastify';

function App() {
  //Session management
  const [user, setSessionData] = useState<{
    id?: number;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  } | null>(null);
  const getSession = async () => {
    const response = await axios.get('http://localhost:3000/api/auth/status', {
      withCredentials: true,
    });
    response.data.user && setSessionData(response.data.user[0]);
    response.data.hasSession
      ? notify(response.data.hasSession, `Welcome back ${user?.firstName}!`)
      : null;
  };
  useEffect(() => {
    getSession();
  }, []);

  const Navbar = () => {
    const [isExpanded, setExpanded] = useState(true);
    const location = useLocation(); // Get current path

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
      <nav className="navigation flex justify-between flex-col p-3 bg-primary text-white gap-10 relative w-fit">
        <div>
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
                  key={nav.label}
                  className={`navlink rounded-md mt-1 cursor-pointer hover:opacity-80 w-full ${
                    location.pathname.includes(nav.route) ? 'bg-teal-800' : ''
                  }`}
                >
                  <Tooltip
                    text={isExpanded ? '' : nav.label}
                    className=""
                    position="right"
                  >
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
        </div>

        <div className="">
          <ul className="list-none">
            <li
              className="navlink flex gap-2 rounded-sm py-1 cursor-pointer w-full"
              style={{
                background: location.pathname.includes('settings')
                  ? 'bg-teal-800'
                  : '',
              }}
            >
              <NavLink
                to="settings"
                className={`navlink flex gap-2 rounded-sm py-1 cursor-pointer ${
                  location.pathname.includes('settings') ? 'bg-teal-800' : ''
                }`}
              >
                <Tooltip text={isExpanded ? '' : 'Settings'} position="right">
                  <Settings />
                </Tooltip>
                <motion.p
                  className="overflow-hidden"
                  animate={{ opacity: 1, width: isExpanded ? 'auto' : 0 }}
                  exit={{ opacity: 0 }}
                >
                  Settings
                </motion.p>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    );
  };

  const Home = () => {
    interface DropdownMenuProps {}

    const DropdownMenu: React.FC<DropdownMenuProps> = () => {
      const [isOpen, setIsOpen] = useState(false);

      const toggleMenu = () => setIsOpen((prev) => !prev);
      const closeMenu = () => setIsOpen(false);

      // Sending a logout request to the browser
      const handleLogout = async () => {
        try {
          const res = await axios.get('http://localhost:3000/api/auth/logout', {
            withCredentials: true,
          });
          notify(res.data.passed, res.data.message);
          setTimeout(() => {
            window.location.href = '/home/dashboard';
          }, 1500);
        } catch (err) {
          console.error('Error submitting form: ', err);
        }
      };

      return (
        <div className="relative inline-block">
          {/* Trigger Button */}
          <button
            onClick={toggleMenu}
            className="relative h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center"
            aria-expanded={isOpen}
            aria-label="Open user menu"
          >
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              }
              alt="Not found"
              className="h-8 w-8 object-cover object-center rounded-full"
            />
          </button>

          {/* Dropdown Content */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="fixed right-2 mt-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onClick={closeMenu} // Auto-close the menu on click
              >
                {user && (
                  <div className="py-3 px-4">
                    {/* Dropdown Header */}
                    <div className="flex flex-col space-y-1">
                      <div className="inline-flex justify-center">
                        <img
                          src={user?.avatar}
                          alt="Not found"
                          className="h-[5em] w-[5em] rounded-full object-cover object-center"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user?.firstName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.firstName + ' ' + user?.lastName}
                      </p>
                    </div>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                {/* Dropdown Items */}
                <div className="py-1">
                  <NavLink to="/home/settings">
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                  </NavLink>
                  {user ? (
                    <NavLink to="/admin">
                      <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </button>
                    </NavLink>
                  ) : (
                    <NavLink to="/auth/clerk/login">
                      <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
                        <LogIn className="mr-2 h-4 w-4" />
                        login
                      </button>
                    </NavLink>
                  )}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                {/* Logout */}
                {user && (
                  <div className="py-1">
                    <button
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                      onClick={handleLogout}
                    >
                      <DoorOpen />
                      Log out
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    };

    return (
      <div className="realtive h-screen w-screen flex bg-background">
        <ToastContainer />

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
              <Tooltip text="Notifications" className="" position="bottom">
                <div className="relative bg-gray-300 p-1 rounded-md hover:opacity-85 cursor-pointer">
                  <BellIcon className="text-sm" fill="gray" stroke="gray" />
                  <span className="text-xs bg-red-500 text-white py-1 px-1 rounded-full absolute top-1 right-2"></span>
                </div>
              </Tooltip>
              <DropdownMenu />
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

          {/* Settings  */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
