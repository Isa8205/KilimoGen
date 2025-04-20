import notify from "@/utils/ToastHelper";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Settings, User, LogIn, LogOut, BellIcon, MailOpenIcon, TriangleAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import  Tooltip  from "../components/Tooltips/Tooltip";
import Navbar from "./MainNavbar";
import { useRecoilState } from "recoil";
import { sessionState } from "@/store/store";
import defaultAvatar from "@/assets/images/defaultUser.png"

const Home = () => {
    interface DropdownMenuProps {}

    const ProfileDropdownMenu: React.FC<DropdownMenuProps> = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [user, setUser] = useRecoilState(sessionState)

      const toggleMenu = () => setIsOpen((prev) => !prev);
      const closeMenu = () => setIsOpen(false);

      // Sending a logout request to the browser
      const handleLogout = async () => {
        try {
          const res = await window.electron.invoke('logout')
          notify(res.passed, res.message);

          if (res.passed) {
            setTimeout(() => {
              setUser(null)
              window.location.href = '/home/dashboard';
            }, 1500);
          }
        } catch (err) {
          console.error('Error submitting form: ', err);
        }
      };

      useEffect(() => {
        window.addEventListener('click', (e) => {
          const dropDown = document.getElementById('drop-down')
          console.log(e.currentTarget)
          console.log(dropDown?.target)
        })
      })

      return (
        <div className="relative inline-block mr-10 m-2">
          {/* Trigger Button */}
          <button
            onClick={toggleMenu}
            className="relative rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center"
            aria-expanded={isOpen}
            aria-label="Open user menu"
          >
            <img
              src={
                user?.avatar ? `data:image/png;base64,${user?.avatar}` : defaultAvatar
              }
              alt="Not found"
              className="h-10 w-10 object-cover object-center rounded-full"
            />
          </button>

          {/* Dropdown Content */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
              id="drop-down"
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
                          src={`data:image/png;base64,${user?.avatar}`}
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
                      className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                      onClick={handleLogout}
                    >
                      <LogOut />
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

    const NotificationDropdown = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [notifications, setNotifications] = useState<notifications[] | []>(
        [],
      );

      const fetchNotifications = async () => {
        const response = await window.electron.invoke("get-notifications")

        try {
          setNotifications(response.data.notifications);
        } catch (err) {
          console.error(err);
        }
      };

      useEffect(() => {
        fetchNotifications();
      }, []);

      const handleNotificatioinSeen = async (
        e: React.MouseEvent<HTMLButtonElement>,
      ) => {
        const id = e.currentTarget.id;
        const response = await axios.put(
          'http://localhost:3000/api/notification/seen/' + id,
        );
        console.log(response.data.message);
        fetchNotifications();
      };

      // Filter unseen notifications
      const unseenNotifications = notifications?.filter((n) => !n.seen);

      return (
        <div className="relative">
          {/* Bell Icon with Notification Badge */}
          <div
            className="relative bg-gray-300 p-[5px] rounded-md hover:opacity-85 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <BellIcon className="w-6 h-6 font-bold text-gray-700" />
            {unseenNotifications?.length > 0 && (
              <span className="text-xs bg-red-500 text-white py-0.5 px-2 rounded-full absolute -top-1 -right-1 ">
                {unseenNotifications?.length}
              </span>
            )}
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{duration: .2}}
              className="fixed right-2 mt-2 w-72 bg-white shadow-lg rounded-lg overflow-hidden z-50"
            >
              <div className="p-4 border-b bg-gray-100 font-semibold text-gray-700">
                Notifications
              </div>

              {/* Notification List */}
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500 p-4">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 flex items-start gap-3 hover:bg-gray-200 ${
                        !notification.seen ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(notification.date).toLocaleString()}
                        </p>
                      </div>

                      <button
                        id={notification.id.toString()}
                        onClick={(e) => handleNotificatioinSeen(e)}
                        className="flex flex-col justify-between items-stretch hover:bg-gray-200"
                      >
                        <MailOpenIcon className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer - View All */}
              <div className="p-2 bg-gray-100 text-center">
                <span className="text-blue-600 text-sm hover:underline">
                  View all notifications
                </span>
              </div>
            </motion.div>
          )}
        </div>
      );
    };

    return (
      <div className="h-screen w-screen flex-col gap-2 bg-background">
        <div className="relative flex bg-background">
          <ToastContainer />

          <Navbar />

          <section className="content w-full text-white h-screen flex flex-col">
            {/* The header of the right section */}
            <div className="flex justify-end items-center bg-white text-black p-2 shadow-md ">

              <div className="relative flex gap-4 items-center">
                <Tooltip text="Notifications" position="bottom">
                  <NotificationDropdown />
                </Tooltip>
                <ProfileDropdownMenu />
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="content-wrapper flex-1 overflow-y-auto p-4 custom-scrollbar">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    );
  };

  export default Home