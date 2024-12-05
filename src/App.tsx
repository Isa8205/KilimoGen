import { BarChart, BellIcon, ChevronDown, ChevronLeft, ChevronRight, DollarSign, FileTextIcon, LayoutDashboard, Leaf, MessageSquareShare, Package, PersonStanding, Settings, Store, Truck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import { Deliveries } from "./components/Deliveries";
import { Inventory } from "./components/Inventory";
import Messaging from "./components/Messaging";

function App() {

    const navItems = [
        { icon: <LayoutDashboard />, label: 'Dashboard', link: <NavLink to="/dashboard">Dashboard</NavLink> },
        { icon: <User />, label: 'Members', link: <NavLink to="/dashboard">Farmers</NavLink> },
        { icon: <Package />, label: 'Production', link: <NavLink to="/production">Production</NavLink> },
        { icon: <Truck />, label: 'Deliveries', link: <NavLink to="/deliveries">Deliveries</NavLink> },
        { icon: <Store />, label: 'Inventory', link: <NavLink to="/inventory">Inventory</NavLink> },
        { icon: <BarChart />, label: 'Analytics', link: <NavLink to="/analytics">Analytics</NavLink> },
        { icon: <DollarSign />, label: 'Financials', link: <NavLink to="/financials">Financials</NavLink> },
        { icon: <FileTextIcon />, label: 'Reports', link: <NavLink to="/reports">Reports</NavLink> },
        { icon: <MessageSquareShare />, label: 'Messaging', link: <NavLink to="/messaging">Messaging</NavLink> },
    ];

    // Responds to when the navigation items are clicked and activates them
    // When reviewing indexes can be added also
    useEffect(() => {
        const navlist = document.querySelectorAll('.navlink')!
        const locationDisp = document.getElementById('current-location')!
        navlist.forEach((nav) => {
            nav.addEventListener('click', () => {
                navlist.forEach((nav) => {
                    nav.classList.remove('bg-pink-500')
                })
                nav.classList.add('bg-pink-500')
                locationDisp.textContent = nav.textContent
            })
        })
    }, [])

    const Navbar = () => {
        const [isExpanded, setExpanded] = useState(false)
        // The list has the navlinks to be used to navigate the site
        // They will be activated on clicing the corresponding item
        // const navlist = [1]
        return (
            <nav className={`navigation flex justify-start flex-col p-3 bg-teal-900 text-white gap-10 md:w-fit relative dark:bg-gray-900 transition-all duration-1000`}>
                <span className="flex gap-2 items-center mt-2">
                    {isExpanded && <h2 className="text-3xl text-nowrap"><Leaf className="inline" /> Olmismis FCS</h2>}
                    <button className="hover:bg-gray-100 hover:text-black rounded-lg px-2 py-2" onClick={() => { setExpanded(isExpanded ? false : true) }}>{isExpanded ? <ChevronLeft className="text-2xl" /> : <ChevronRight className="text-2xl" />}</button>
                </span>

                <div className="mid">
                    <ul className="list-none">
                        {
                            navItems.map((nav) => (
                                <li
                                    key={nav.label}
                                    onClick={() => { setExpanded(true) }}
                                    className="navlink flex gap-2 rounded-md py-2 mt-1 ps-2 cursor-pointer hover:bg-gray-50 hover:text-black"
                                >
                                    <span className="pe-2">{nav.icon}</span> {isExpanded && <p>{nav.label}</p>}
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className="absolute bottom-3 right-3 left-3">
                    <ul className="list-none">
                        <li className="navlink flex gap-2 rounded-sm py-1 cursor-pointer"><Settings /> {isExpanded && <p>Settings</p>}</li>
                    </ul>
                </div>
            </nav>
        )
    }
    return (
        <div className="h-screen flex gap-4 bg-gray-200 dark:bg-gray-700" >
            <Navbar />

            <section className="content w-full text-white max-h-screen  py-2 pr-2">
                {/* The header of the right section */}
                <div className="flex justify-between items-center  bg-teal-900 p-4 rounded-lg sticky top-0 left-0 right-0 dark:bg-gray-900">
                    <h2 className="text-2xl font-bold" id="current-location">Dashboard</h2>

                    <div className="profile rounded-lg flex justify-between items-center gap-4">
                        <span className="notifications relative bg-teal-600 dark:bg-gray-600 rounded-full p-1">
                            <BellIcon />
                            <span className="badge absolute bg-red-600 px-2 -top-2 -right-2 rounded-full text-sm">3</span>
                        </span>

                        <span className="flex flex-row-reverse gap-2 items-center justify-between bg-teal-600 dark:bg-gray-600 rounded-full p-1 relative">
                            <ChevronDown />
                            <p className="text-sm">Chepkwony</p>
                            <img src="https://picsum.photos/450/350" alt="Profile" className="rounded-full object-cover h-10 w-10" />
                        </span>
                    </div>
                </div>

                {/* The different contents of the nav */}
                <div className="container bg-teal-900 mt-6 p-8 rounded-lg dark:bg-gray-900 overflow-y-scroll" style={{ maxHeight: '85vh' }}>
                    <Routes>
                        <Route path="/" Component={Deliveries} />
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