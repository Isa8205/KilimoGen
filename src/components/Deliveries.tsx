import { ArrowDownAZIcon, ArrowDownZA, ChevronDown, FilterIcon, FilterX, Plus, X } from "lucide-react";
import { MouseEventHandler, ReactElement, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Fuse from "fuse.js";

export function Deliveries() {

    const fetchedDeliveries = [
        { farmer: 'Wesley Too ', farmerNumber: 10, served_by: 'Chepkwony', product: 'Mbuni', quantity: 7000, date: '2024-1-1', harvest: 2, season: '2022/23' },
        { farmer: 'Sammy Cheruiyot ', farmerNumber: 17, served_by: 'Chepkwony', product: 'Cherry', quantity: 50, date: '2024-12-1', harvest: 1, season: '2024/25' },
        { farmer: 'Wesley Too ', farmerNumber: 87, served_by: 'Chepkwony', product: 'Mbuni', quantity: 10, date: '2024-11-1', harvest: 3, season: '2024/25' },
        { farmer: 'Wesley Too ', farmerNumber: 67, served_by: 'Chepkwony', product: 'Mbuni', quantity: 100, date: '2024-11-1', harvest: 3, season: '2022/25' },
        { farmer: 'Sammy Cheruiyot ', farmerNumber: 37, served_by: 'Chepkwony', product: 'Cherry', quantity: 5000, date: '2024-12-1', harvest: 1, season: '2021/22' },
        { farmer: 'Sammy Cheruiyot ', farmerNumber: 17, served_by: 'Chepkwony', product: 'Cherry', quantity: 50, date: '2024-12-1', harvest: 1, season: '2024/25' },
        { farmer: 'Wesley Too ', farmerNumber: 157, served_by: 'Chepkwony', product: 'Mbuni', quantity: 4500, date: '2024-12-12', harvest: 2, season: '2024/25' },
        { farmer: 'Paul Too ', farmerNumber: 17, served_by: 'Chepkwony', product: 'Cherry', quantity: 30, date: '2024-12-4', harvest: 1, season: '2023/24' },
        { farmer: 'Wesley Too ', farmerNumber: 417, served_by: 'Chepkwony', product: 'Mbuni', quantity: 1034, date: '2024-11-1', harvest: 3, season: '2024/25' },
        { farmer: 'Sammy Cheruiyot ', farmerNumber: 27, served_by: 'Chepkwony', product: 'Cherry', quantity: 50, date: '2024-12-1', harvest: 1, season: '2024/25' },
        { farmer: 'Wesley Too ', farmerNumber: 17, served_by: 'Chepkwony', product: 'Mbuni', quantity: 120, date: '2024-11-1', harvest: 3, season: '2023/24' },
        { farmer: 'Wesley Too ', farmerNumber: 17, served_by: 'Chepkwony', product: 'Mbuni', quantity: 10, date: '2024-11-1', harvest: 3, season: '2022/23' },
        { farmer: 'Sammy Cheruiyot ', farmerNumber: 17, served_by: 'Chepkwony', product: 'Cherry', quantity: 50, date: '2024-12-1', harvest: 1, season: '2024/25' },
        { farmer: 'Wesley Too ', farmerNumber: 17, served_by: 'Chepkwony', product: 'Mbuni', quantity: 1000, date: '2024-11-1', harvest: 3, season: '2022/23' },
        { farmer: 'Wesley Too ', farmerNumber: 17, served_by: 'Chepkwony', product: 'Mbuni', quantity: 25600, date: '2024-11-1', harvest: 3, season: '2024/25' },
        { farmer: 'Sammy Cheruiyot ', farmerNumber: 17, served_by: 'Chepkwony', product: 'Cherry', quantity: 50000, date: '2024-12-1', harvest: 1, season: '2024/25' },
        { farmer: 'Wesley Too ', farmerNumber: 7, served_by: 'Chepkwony', product: 'Mbuni', quantity: 10, date: '2024-11-1', harvest: 3, season: '2021/22' },
        { farmer: 'Wesley Too ', farmerNumber: 17, served_by: 'Chepkwony', product: 'Mbuni', quantity: 10, date: '2024-11-1', harvest: 3, season: '2024/25' },
    ]

    const [sortType, setSortType] = useState('descending')

    // The search functionality
    const [query, setQuery] = useState('')
    const fuse = new Fuse(fetchedDeliveries, {
        keys: [
            'farmer',
            'farmerNumber'
        ]
    })
    const results = fuse.search(query)
    const searchResulsts = results.map(result => result.item)

    const [deliveries, setDeliveries] = useState(query !== '' ? searchResulsts : fetchedDeliveries)
    useEffect(() => {
        const searchBar = document.querySelector('input[type="search"]')!
        searchBar.addEventListener('input', ({ target }: Event) => {
            const inputVal = target.value
            console.log(inputVal)
            setQuery(inputVal)
        })
    }, [])


    // Modal body and box
    const [modalDisp, setModalDisp] = useState(false)
    const Modal = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                    {/* Dialog Header */}
                    <div className="border-b p-4">
                        <span className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Add New Delivery</h2>
                            <X className="bg-gray-100 cursor-pointer hover:bg-red-500 hover:text-white rounded-sm" onClick={() => (setModalDisp(false))} />
                        </span>
                        <p className="text-sm text-gray-600">Enter the details for the new delivery.</p>
                    </div>

                    {/* Dialog Content */}
                    <div className="p-4">
                        <div className="grid gap-4">
                            {/* Product Input */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="product" className="text-right font-medium text-sm text-gray-700">
                                    Product
                                </label>
                                <input
                                    id="product"
                                    className="col-span-3 p-2 border rounded-md focus:outline-none focus:ring focus:ring-pink-500"
                                />
                            </div>
                            {/* Quantity Input */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="quantity" className="text-right font-medium text-sm text-gray-700">
                                    Quantity
                                </label>
                                <input
                                    id="quantity"
                                    type="number"
                                    className="col-span-3 p-2 border rounded-md focus:outline-none focus:ring focus:ring-pink-500"
                                />
                            </div>
                            {/* Destination Input */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="destination" className="text-right font-medium text-sm text-gray-700">
                                    Destination
                                </label>
                                <input
                                    id="destination"
                                    className="col-span-3 p-2 border rounded-md focus:outline-none focus:ring focus:ring-pink-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dialog Footer */}
                    <div className="border-t p-4 flex justify-end">
                        <button
                            className="bg-black text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-300"
                        >
                            Add Delivery
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // The filtering of the content that is displayed
    const [quantityFilterValue, setQuantityFilter] = useState(0)
    const qunatityItems = [
        { label: 'None', onClick: () => setQuantityFilter(0) },
        { label: 'above 10', onClick: () => setQuantityFilter(10) },
        { label: 'above 100', onClick: () => setQuantityFilter(100) },
        { label: 'above 1,000', onClick: () => setQuantityFilter(1000) },
        { label: 'above 10,000', onClick: () => setQuantityFilter(10000) },
    ]

    const [berryFilter, setBerryFilter] = useState('')
    const berrytypeItems = [
        { label: 'None', onClick: () => setBerryFilter('') },
        { label: 'Mbuni', onClick: () => setBerryFilter(berryFilter === 'Mbuni' ? 'Cherry' : 'Mbuni') },
        { label: 'Cherry', onClick: () => setBerryFilter(berryFilter === 'Mbuni' ? 'Cherry' : 'Mbuni') },
    ]

    const [seasonFilter, setSeasonFilter] = useState('')
    const seasonFilterItems = [
        { label: '2024/25', onClick: () => setSeasonFilter('2024/25') },
        { label: '2023/24', onClick: () => setSeasonFilter('2023/24') },
        { label: '2022/23', onClick: () => setSeasonFilter('2022/23') },
        { label: '2021/22', onClick: () => setSeasonFilter('2021/22') },
    ]

    type DropDownTypes = {
        dropItems: {
            label: string,
            onClick: MouseEventHandler,
        }[],
        text: ReactElement | string,
        styles: string
    }

    const DropDown = ({ dropItems, text, styles }: DropDownTypes) => {
        const [isOpen, setIsOpen] = useState(false);
        const dropRef = useRef<HTMLSpanElement>(null);
        const dropMenuRef = useRef<HTMLDivElement>(null);


        useEffect(() => {
            if (dropRef.current && dropMenuRef.current) {
                const rect = dropRef.current.getBoundingClientRect();
                dropMenuRef.current.style.position = "absolute";
                dropMenuRef.current.style.top = `${rect.height}px`;
                dropMenuRef.current.style.width = `auto`;
            }
        }, []);

        return (
            <span className={`relative inline-flex z-0 items-center gap-1 `}>
                {/* Dropdown Trigger */}
                <span ref={dropRef} className={`inline-flex items-center ${styles}`}>
                    <p className="flex">{text}</p>
                    <motion.button
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                    >
                        <ChevronDown />
                    </motion.button>
                </span>

                {/* Dropdown Menu */}
                <motion.div
                    ref={dropMenuRef}
                    animate={{ height: isOpen ? "auto" : 0 }}
                    className="dropdown top-0 overflow-hidden bg-teal-500 dark:bg-gray-500"
                    initial={false}
                >
                    {
                        dropItems.map((item, i) => (
                            <span
                                key={i}
                                onClick={item.onClick}
                                className="block m-1 px-2 py-1 rounded-md cursor-pointer hover:dark:bg-gray-800 hover:bg-teal-800 text-nowrap"
                            >{item.label}
                            </span>
                        ))
                    }
                </motion.div>
            </span>
        );
    };


    return (
        <div className="w-full">
            {modalDisp && <Modal />}
            <h2 className="mb-2 text-2xl">Delivery summary</h2>

            <div className="mb-4 flex justify-between items-baseline">

                <div className="inline-flex gap-3 items-baseline">
                    <span>
                        <label htmlFor="season">Season</label><br />
                        <DropDown dropItems={seasonFilterItems} text={seasonFilter} styles='px-2 py-1 bg-gray-600 rounded-md' />

                    </span>

                    <span>
                        <label htmlFor="season">Harvest</label><br />
                        <DropDown styles="" dropItems={seasonFilterItems} text={seasonFilter !== '' ? <FilterIcon /> : <FilterX />} />
                    </span>
                </div>

                <span className=" flex items-baseline">
                    <input
                        type="search"
                        name="search"
                        placeholder="eg. 123 or Jane Doe"
                        className="p-2 text-black rounded-l-md"

                    />

                    <button className="py-2 px-2 bg-gray-50 hover:bg-pink-500 text-black hover:text-white border-l-2 rounded-r-md">Search</button>
                </span>

            </div>

            <div className="flex justify-between items-center">
                <span className="inline-flex gap-2">
                    <button className="flex gap-4 bg-teal-500 dark:bg-gray-600 text-white p-2 rounded-md"><FilterIcon />This month <ChevronDown /></button>
                    <button className="flex bg-teal-500 dark:bg-gray-600 text-white p-2 rounded-md" onClick={() => (setSortType(sortType === 'ascending' ? 'descending' : 'ascending'))}>{sortType === 'ascending' ? <ArrowDownAZIcon /> : <ArrowDownZA />}</button>
                </span>
                <button
                    className="p-2 rounded-md bg-white text-black flex hover:bg-pink-500 hover:text-white"
                    onClick={() => (setModalDisp(true))}
                >
                    <Plus /> Add a delivery
                </button>
            </div>

            <table className="w-full my-2">
                <thead className="border-b-2 font-bold text-center">
                    <tr>
                        <td>No.</td>
                        <td>Farmer</td>
                        <td><span className="inline-flex justify-center">Quantity(kgs) <DropDown styles="" dropItems={qunatityItems} text={quantityFilterValue !== 0 ? <FilterIcon /> : <FilterX />} /></span></td>
                        <td><span className="inline-flex justify-center">Berry Type <DropDown styles="" dropItems={berrytypeItems} text={berryFilter !== '' ? <FilterIcon /> : <FilterX />} /></span></td>
                        <td>Date</td>
                        <td>Served By</td>
                    </tr>
                </thead>

                <tbody>
                    {deliveries
                        .sort((a, b) => {
                            if (sortType === 'descending') {
                                return b.date.toString().localeCompare(a.date.toString()); // Descending order
                            } else {
                                return a.date.toString().localeCompare(b.date.toString()); // Ascending order
                            }
                        })
                        .filter(delivery => delivery.season === seasonFilter)
                        .filter(delivery => delivery.product === berryFilter)
                        .filter(delivery => delivery.quantity >= quantityFilterValue)
                        .map((delivery, index) => (
                            <tr key={index} className="even:bg-teal-700 even:dark:bg-gray-700 hover:bg-cyan-400 cursor-pointer">
                                <td className="py-3 text-center">{index + 1}</td>
                                <td className="py-3 text-center">{delivery.farmer} {`(${delivery.farmerNumber})`}</td>
                                <td className="py-3 text-center">{delivery.quantity} {delivery.season}</td>
                                <td className="py-3 text-center">{delivery.product}</td>
                                <td className="py-3 text-center">{delivery.date}</td>
                                <td className="py-3 text-center">{delivery.served_by}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}