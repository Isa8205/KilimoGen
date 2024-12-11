import { BarChart, BellIcon, ChevronDown, ChevronLeft, ChevronRight, DollarSign, FileTextIcon, LayoutDashboard, Leaf, MessageSquareShare, Package, Settings, Store, Truck, User } from "lucide-react";
import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import { Deliveries } from "./components/Deliveries";
import { Inventory } from "./components/Inventory";
import { Messaging } from "./components/Messaging";
import { motion } from "framer-motion";
import { DropDown } from "./components/DropDown";

function App() {

    // The active tab
    const [activeTab, setActiveTab] = useState('Dashboard')

    const Navbar = () => {
        const [isExpanded, setExpanded] = useState(true);

        const navItems = [
            { icon: <LayoutDashboard />, label: "Dashboard", route: "/" },
            { icon: <User />, label: "Members", route: "/dashboard" },
            { icon: <Package />, label: "Production", route: "/production" },
            { icon: <Truck />, label: "Deliveries", route: "/deliveries" },
            { icon: <Store />, label: "Inventory", route: "/inventory" },
            { icon: <BarChart />, label: "Analytics", route: "/analytics" },
            { icon: <DollarSign />, label: "Financials", route: "/financials" },
            { icon: <FileTextIcon />, label: "Reports", route: "/report" },
            { icon: <MessageSquareShare />, label: "Messaging", route: "/messaging" },
        ];

        return (
            <nav
                className={`navigation flex justify-start flex-col p-3 bg-teal-900 text-white gap-10 md:w-fit relative dark:bg-gray-900`}
            >
                <span className="flex gap-2 items-center mt-2">
                    <motion.h2
                        className="text-3xl text-nowrap overflow-hidden"
                        animate={{ opacity: 1, width: isExpanded ? "auto" : 0 }}
                        transition={{ duration: .15, ease: "easeInOut" }}
                        exit={{ opacity: 0 }}
                    >
                        <Leaf className="inline" /> KilimoGen
                    </motion.h2>
                    <span
                        className="hover:bg-gray-100 hover:text-black rounded-lg inline-flex items-center px-2 py-2"
                        onClick={() => setExpanded((prev) => !prev)}
                    >
                        <motion.button
                            animate={{ rotate: isExpanded ? 0 : 180 }}
                            transition={{ duration: .5, ease: 'easeInOut' }}
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
                                onClick={() => {
                                    setActiveTab(nav.label);
                                }}
                                className={`navlink rounded-md mt-1 cursor-pointer hover:bg-gray-50 hover:text-black ${nav.label === activeTab ? "bg-pink-500" : ""}`}
                            >
                                <NavLink
                                    onClick={() => setExpanded((prev) => !prev)}
                                    to={nav.route}
                                    className="flex py-2 ps-2 gap-1"
                                >
                                    <span>{nav.icon}</span>
                                    <motion.p
                                        animate={{ opacity: 1, width: isExpanded ? "auto" : 0 }}
                                        className="overflow-hidden"
                                        exit={{ opacity: 0 }}
                                    >
                                        {nav.label}
                                    </motion.p>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="absolute bottom-3 right-3 left-3">
                    <ul className="list-none">
                        <li className="navlink flex gap-2 rounded-sm py-1 cursor-pointer">
                            <Settings />
                            <motion.p
                                className="overflow-hidden"
                                animate={{ opacity: 1, width: isExpanded ? "auto" : 0 }}
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

    // The items for the profile dropdown
    const ProfileItems = [
        { label: 'Log out', onClick: () => (0) }
    ]

    return (
        <div className="h-screen w-screen overflow-hidden flex gap-4 bg-gray-200 dark:bg-gray-700" >
            <Navbar />

            <section className="content w-full text-white max-h-screen  py-2 pr-2">
                {/* The header of the right section */}
                <div className="flex justify-between items-center  bg-teal-900 p-4 rounded-lg sticky top-0 left-0 right-0 dark:bg-gray-900">
                    <h2 className="text-2xl font-bold">{activeTab}</h2>

                    <div className="profile rounded-lg flex justify-between items-center gap-4">
                        <span className="notifications relative bg-teal-600 dark:bg-gray-600 rounded-full p-1">
                            <BellIcon />
                            <span className="badge absolute bg-red-600 px-2 -top-2 -right-2 rounded-full text-sm">3</span>
                        </span>

                        <DropDown styles="" dropItems={ProfileItems} text={
                            <span className="flex flex-row-reverse gap-2 items-center justify-between bg-teal-600 dark:bg-gray-600 rounded-full p-1 relative">
                                <ChevronDown />
                                <p className="text-sm">Chepkwony</p>
                                <img src="https://picsum.photos/450/350" alt="Profile" className="rounded-full object-cover h-10 w-10" />
                            </span>
                        } />
                    </div>
                </div>

                {/* The different contents of the nav */}
                <div className="container bg-teal-900 mt-6 p-8 rounded-lg dark:bg-gray-900 overflow-y-scroll" style={{ maxHeight: '85vh' }}>
                    <Routes>
                        <Route path="/" Component={Dashboard} />
                        <Route path="/deliveries" Component={Deliveries} />
                        <Route path="/inventory" Component={Inventory} />
                        <Route path="/reports" Component={Reports} />
                        <Route path="/messaging" Component={Messaging} />
                    </Routes>
                </div>
            </section>
        </div>
    )
}

export default App;