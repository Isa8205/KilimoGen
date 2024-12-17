import { ArrowDownAZIcon, ArrowDownZA, ChevronDown, FilterIcon, FilterX, LucideScanSearch, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import Fuse, { FuseResult } from "fuse.js";
import { DropDown } from "./DropDown";

export function Deliveries() {

    const data = [
        { farmer: 'Jane Doe', farmerNumber: 21, served_by: 'Kimani', product: 'Mbuni', quantity: 8000, date: '2024-2-1', harvest: 2, season: '2023/24' },
        { farmer: 'John Smith', farmerNumber: 42, served_by: 'Mwangi', product: 'Cherry', quantity: 100, date: '2024-11-15', harvest: 1, season: '2024/25' },
        { farmer: 'Mary Wanjiku', farmerNumber: 89, served_by: 'Kimani', product: 'Mbuni', quantity: 20, date: '2024-10-20', harvest: 3, season: '2024/25' },
        { farmer: 'Paul Kariuki', farmerNumber: 35, served_by: 'Mwangi', product: 'Mbuni', quantity: 150, date: '2024-10-20', harvest: 3, season: '2023/24' },
        { farmer: 'Grace Njeri', farmerNumber: 45, served_by: 'Kimani', product: 'Cherry', quantity: 6000, date: '2024-11-30', harvest: 1, season: '2022/23' },
        { farmer: 'Jane Doe', farmerNumber: 25, served_by: 'Kimani', product: 'Cherry', quantity: 75, date: '2024-11-15', harvest: 1, season: '2024/25' },
        { farmer: 'Michael Otieno', farmerNumber: 153, served_by: 'Mwangi', product: 'Mbuni', quantity: 3500, date: '2024-11-18', harvest: 2, season: '2024/25' },
        { farmer: 'Lucy Nyambura', farmerNumber: 78, served_by: 'Kimani', product: 'Cherry', quantity: 40, date: '2024-11-19', harvest: 1, season: '2023/24' },
        { farmer: 'John Smith', farmerNumber: 200, served_by: 'Mwangi', product: 'Mbuni', quantity: 1200, date: '2024-10-10', harvest: 3, season: '2024/25' },
        { farmer: 'Peter Kamau', farmerNumber: 33, served_by: 'Kimani', product: 'Cherry', quantity: 100, date: '2024-11-15', harvest: 1, season: '2024/25' },
        { farmer: 'Jane Doe', farmerNumber: 18, served_by: 'Kimani', product: 'Mbuni', quantity: 180, date: '2024-10-20', harvest: 3, season: '2023/24' },
        { farmer: 'Michael Otieno', farmerNumber: 95, served_by: 'Mwangi', product: 'Mbuni', quantity: 15, date: '2024-10-15', harvest: 3, season: '2023/24' },
        { farmer: 'John Smith', farmerNumber: 24, served_by: 'Kimani', product: 'Cherry', quantity: 600, date: '2024-11-15', harvest: 1, season: '2024/25' },
        { farmer: 'Grace Njeri', farmerNumber: 57, served_by: 'Kimani', product: 'Mbuni', quantity: 900, date: '2024-10-20', harvest: 3, season: '2023/24' },
        { farmer: 'Jane Doe', farmerNumber: 12, served_by: 'Mwangi', product: 'Mbuni', quantity: 27000, date: '2024-10-10', harvest: 3, season: '2024/25' },
        { farmer: 'Lucy Nyambura', farmerNumber: 24, served_by: 'Kimani', product: 'Cherry', quantity: 52000, date: '2024-11-15', harvest: 1, season: '2024/25' },
        { farmer: 'Paul Kariuki', farmerNumber: 67, served_by: 'Mwangi', product: 'Mbuni', quantity: 15, date: '2024-10-10', harvest: 3, season: '2021/22' },
        { farmer: 'Mary Wanjiku', farmerNumber: 59, served_by: 'Kimani', product: 'Mbuni', quantity: 25, date: '2024-10-20', harvest: 3, season: '2024/25' },
    ];

    const [sortType, setSortType] = useState('descending')

    // The search functionality
    const [query, setQuery] = useState('')
    const fuse = new Fuse(data, {
        keys: [
            'farmer',
            'farmerNumber'
        ],
        includeScore: true,
        includeMatches: true,
    })
    const results: unknown = fuse.search(query)
    const searchResulsts = results.filter(result => result.score <= .3).map(result => result.item)

    // Set the data to be displayed
    const deliveries = query ? searchResulsts : data
    const handleSearch = ({ currentTarget }: { currentTarget: EventTarget & { value?: string } }) => {
        const { value }: { value?: string } = currentTarget
        setQuery(value as string)
    };

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

    const [seasonFilter, setSeasonFilter] = useState('All')
    const seasonFilterItems = [
        { label: 'All', onClick: () => setSeasonFilter('All') },
        { label: '2024/25', onClick: () => setSeasonFilter('2024/25') },
        { label: '2023/24', onClick: () => setSeasonFilter('2023/24') },
        { label: '2022/23', onClick: () => setSeasonFilter('2022/23') },
        { label: '2021/22', onClick: () => setSeasonFilter('2021/22') },
    ]

    const [harvestFilter, setHarvestFilter] = useState(['All', 0])
    const harvestFilterItems = [
        { label: 'All', onClick: () => setHarvestFilter(['All', 0]) },
        { label: 'Harvest 1', onClick: () => setHarvestFilter(['Harvest 1', 1]) },
        { label: 'Harvest 2', onClick: () => setHarvestFilter(['Harvest 2', 2]) },
        { label: 'Harvest 3', onClick: () => setHarvestFilter(['Harvest 3', 3]) },
    ]

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
                        <DropDown dropItems={harvestFilterItems} text={harvestFilter[0]} styles='px-2 py-1 bg-gray-600 rounded-md' />
                    </span>
                </div>

                <span className="flex border-b-2 border-b-gray-400">
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder="eg. 123 or Jane Doe"
                        className="bg-transparent p-1 text-white focus-visible:outline-none"

                    />

                    <button className="px-2"><Search className="text-gray-400" /></button>
                </span>

            </div>

            <div className="flex justify-between items-center">
                <span className="inline-flex gap-2">
                    <button className="flex gap-4 bg-teal-500 dark:bg-gray-600 text-white p-2 rounded-md"><FilterIcon />This month <ChevronDown /></button>
                    <button className="flex bg-teal-500 dark:bg-gray-600 text-white p-2 rounded-md" onClick={() => (setSortType(sortType === 'ascending' ? 'descending' : 'ascending'))}>{sortType === 'ascending' ? <ArrowDownAZIcon /> : <ArrowDownZA />}</button>
                </span>
                <button
                    className="p-2 rounded-md bg-gray-200 text-black flex hover:bg-pink-500 hover:text-white"
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
                        .filter(delivery => seasonFilter === 'All' ? delivery.season === delivery.season : delivery.season === seasonFilter)
                        .filter(delivery => harvestFilter[1] === 0 ? delivery.harvest === delivery.harvest : delivery.harvest === harvestFilter[1])
                        .filter(delivery => delivery.product !== berryFilter)
                        .filter(delivery => delivery.quantity >= quantityFilterValue)
                        .map((delivery, index) => (
                            <tr key={index} className="even:bg-teal-700 even:dark:bg-gray-700 hover:bg-cyan-400 cursor-pointer">
                                <td className="py-3 text-center">{index + 1}</td>
                                <td className="py-3 text-center">{delivery.farmer} {`(${delivery.farmerNumber})`}</td>
                                <td className="py-3 text-center">{delivery.quantity}</td>
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