import { ArrowDownAZIcon, ArrowDownZA, ChevronDown, FilterIcon, Plus, X } from "lucide-react";
import { useState } from "react";

export default function Messaging() {

    const deliveries = [
        { product: 'Mbuni', quantity: 70, date: '2024-1-1', state: 'Delivered' },
        { product: 'Cherry', quantity: 50, date: '2024-12-1', state: 'Delivered' },
        { product: 'Mbuni', quantity: 45, date: '2024-12-12', state: 'Delivered' },
        { product: 'Cherry', quantity: 30, date: '2024-12-4', state: 'Delivered' },
        { product: 'Mbuni', quantity: 10, date: '2024-11-1', state: 'Delivered' },
    ]

    const [sortType, setSortType] = useState('descending')

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


    return (
        <div className="w-full">
            {modalDisp && <Modal />}
            <h2 className="mb-2 text-2xl">Messaging summary</h2>

            <div className="mb-4 flex justify-between items-baseline">

                <div className="inline-flex gap-3 items-baseline">
                    <span>
                        <label htmlFor="season">Season</label><br />
                        <select name="season" id="season" className="text-white px-10 rounded-sm bg-teal-500 dark:bg-gray-600">
                            <option value="24/25">2024/2025</option>
                            <option value="24/25">2024/2025</option>
                            <option value="24/25">2024/2025</option>
                        </select>
                    </span>

                    <span>
                        <label htmlFor="season">Harvest</label><br />
                        <select name="season" id="season" className="text-white px-10 rounded-sm bg-teal-500 dark:bg-gray-600">
                            <option value="24/25">Harvest 1</option>
                            <option value="24/25">Harvest 2</option>
                        </select>
                    </span>
                </div>

                <span className=" flex items-baseline">
                    <input type="search" name="search" id="search" placeholder="eg. 123 or Jane Doe" className="p-2 text-black rounded-l-md" style={{ minWidth: 0 }} />
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
                        <td>Product</td>
                        <td className="flex justify-center">Quantity(Kgs) <FilterIcon className="text-transparent hover:text-white" /> <ChevronDown className="cursor-pointer text-transparent  hover:text-white" /></td>
                        <td>Date</td>
                        <td>State</td>
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
                        .filter(delivery => delivery.quantity >= 0)
                        .map((delivery, index) => (
                            <tr className="even:bg-teal-700 even:dark:bg-gray-700 hover:bg-cyan-400 cursor-pointer">
                                <td className="py-3 text-center">{index + 1}</td>
                                <td className="py-3 text-center">{delivery.product}</td>
                                <td className="py-3 text-center">{delivery.quantity}</td>
                                <td className="py-3 text-center">{delivery.date}</td>
                                <td className="py-3 text-center"><span className="p-1 rounded-sm text-green-900 bg-green-400 text-sm font-semibold">{delivery.state}</span></td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}