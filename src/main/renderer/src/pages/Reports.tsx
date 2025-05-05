import { EyeIcon } from "lucide-react";

export default function Reports() {
    return (
        <div className="bg-transparent shadow-md rounded-lg">
            <div className="mb-6">
                <h2 className="mb-2 text-2xl">Reports summary</h2>
            </div>
            <div className="">
                <table className="min-w-full ">
                    <thead>
                        <tr className="border-b font-bold">
                            <th>No.</th>
                            <th className="px-4 py-2 text-center text-sm font-medium">
                                Report Name
                            </th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-white">
                                Date
                            </th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-white">
                                Type
                            </th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-white">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(30)].map((_, index) => (
                            <tr key={index} className="text-white hover:text-gray-800 even:bg-gray-600 hover:bg-gray-50">
                                <td className="text-center">{index + 1}</td>
                                <td className="py-2 text-center">Annual cherry weight</td>
                                <td className="py-2 text-center">202{Math.floor(Math.random() * 9) + 1}-{Math.floor(Math.random() * 12) + 1}-{Math.floor(Math.random() * 30) + 1}</td>
                                <td className="py-2 text-center">PDF</td>
                                <td className="p-2 flex justify-center">
                                    <button className="flex items-center px-3 py-1 text-sm font-medium bg-gray-300 text-black rounded-md">
                                        <EyeIcon className="w-4 h-4 mr-2" />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}