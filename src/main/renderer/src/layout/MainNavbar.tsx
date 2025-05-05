import Logo from "@/components/Logo";
import { motion } from "framer-motion";
import { LayoutDashboard, User, Truck, Store, FileTextIcon, MessageSquareShare, ChevronLeft, Settings } from "lucide-react";
import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import  Tooltip  from "../components/Tooltips/Tooltip";

const Navbar = () => {
    const [isExpanded, setExpanded] = useState(true);
    const location = useLocation(); // Get current path

    const navItems = [
      { icon: <LayoutDashboard />, label: 'Dashboard', route: 'dashboard', allowedRoles:['clerk', 'admin', 'guest'] },
      { icon: <User />, label: 'Farmers', route: 'farmers', allowedRoles:['clerk', 'admin', 'guest']  },
      // { icon: <Package />, label: "Production", route: "production", allowedRoles:['clerk', 'admin', 'guest']  },
      { icon: <Truck />, label: 'Deliveries', route: 'deliveries', allowedRoles:['clerk', 'admin', 'guest']  },
      { icon: <Store />, label: 'Inventory', route: 'inventory', allowedRoles:['clerk', 'admin', 'guest']  },
      // { icon: <BarChart />, label: "Analytics", route: "analytics", allowedRoles:['clerk', 'admin', 'guest']  },
      // { icon: <DollarSign />, label: "Financials", route: "financials", allowedRoles:['clerk', 'admin', 'guest']  },
      { icon: <FileTextIcon />, label: 'Reports', route: 'reports', allowedRoles:['clerk', 'admin', 'guest']  },
      { icon: <MessageSquareShare />, label: 'Messaging', route: 'messaging', allowedRoles:['clerk', 'admin', 'guest']  },
    ];

    return (
      <nav className="navigation flex justify-between flex-col p-3 bg-primary text-white gap-10 relative w-fit">
        <div>
          <span className="flex flex-col justify-center items-center mt-2 mb-10">
            <Logo />
            <motion.h2
              className="text-3xl text-nowrap inline-flex flex-col items-center overflow-hidden whitespace-nowrap"
              animate={{ width: isExpanded ? 'auto' : 0 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              exit={{ opacity: 0 }}
            >
              KilimoGen
            </motion.h2>
          </span>

            <span
              className="absolute bottom-10 z-20 -right-6 opacity-40 hover:opacity-100 bg-gray-600 rounded-r-md inline-flex py-2  items-center"
              onClick={() => setExpanded((prev) => !prev)}
            >
              <motion.button
                className="inline-flex justify-center"
                animate={{ rotate: isExpanded ? 0 : 180 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
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

        <div>
          <ul className="list-none">
            <li
              className={`navlink rounded-md mt-1 cursor-pointer hover:opacity-80 w-full ${
                location.pathname.includes('settings') ? 'bg-teal-800' : ''
              }`}
            >
              <Tooltip text={isExpanded ? '' : 'Settings'} position="right">
                <NavLink
                  to="settings"
                  className="inline-flex py-2 ps-2 gap-2 justify-start items-center"
                >
                  <span>
                    <Settings />
                  </span>

                  <motion.p
                    animate={{ opacity: 1, width: isExpanded ? 'auto' : 0 }}
                    className="overflow-hidden text-sm text-center"
                    exit={{ opacity: 0 }}
                  >
                    Settings
                  </motion.p>
                </NavLink>
              </Tooltip>
            </li>
          </ul>
        </div>
      </nav>
    );
  };

  export default Navbar