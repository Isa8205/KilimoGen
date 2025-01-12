import { Package } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="overview container flex justify-between items-center gap-4 flex-wrap">
            {[...Array(3)].map(_ => (
                <div className="flex-grow bg-gray-500 p-5 px-7 rounded-md">
                    <span className="flex justify-between">
                        <p>Total production</p>
                        <Package />
                    </span>

                    <h4 className="text-2xl font-bold">1200 Units</h4>

                    <p className="text-sm text-gray-200"> +15% from the last one</p>
                </div>

            ))}
        </div>

    )
}