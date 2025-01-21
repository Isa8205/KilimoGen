import { ChevronLeft, ChevronRight, Clipboard, Package, Tractor, TrendingUpIcon, Truck } from "lucide-react";

export default function Dashboard() {
    const date = new Date
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const quickActions = [
        { id: 1, title: "Add Task" },
        { id: 2, title: "Schedule Equipment" },
        { id: 3, title: "Request Supply"},
        { id: 4, title: "Report Issue" },
      ]

      const urgentTasks = [
        { id: 1, title: "Harvesting crops", date: "Today" },
        { id: 2, title: "Fertilizing soil", date: "Today" },
        { id: 3, title: "Irrigating fields", date: "Today" },
      ]
    return (
        <section className="text-gray-700">
            {/* {[...Array(3)].map(_ => (
                <div className="flex-grow bg-secondary p-5 px-7 rounded-md">
                    <span className="flex justify-between">
                        <p>Total production</p>
                        <Package />
                    </span>

                    <h4 className="text-2xl font-bold">1200 Units</h4>

                    <p className="text-sm text-gray-200"> +15% from the last one</p>
                </div>

            ))} */}

            <div className="flex gap-4 justify-between flex-wrap">
                {/* Calendar */}
                <div className="bg-white text-black shadow-md rounded-md p-4">
                    <div className="flex justify-between font-bold pb-4">
                        <h2 className="text-xl">{months[date.getMonth()]} &nbsp; {date.getFullYear()}</h2>
                        <span className="text-white inline-flex gap-2">
                            <ChevronLeft className="bg-gray-700 text-center rounded-full"/>
                            <ChevronRight className="bg-gray-700 text-center rounded-full"/>
                        </span>
                    </div>

                    <div className="flex justify-between items-center pb-5">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thur</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>

                    <div className="grid grid-cols-7 gap-x-10 gap-y-6">
                        {[...Array(30)].map((_,i) => (
                            <div className="flex justify-center">
                                <span className="w-6 h-6 rounded-full text-center bg-gray-200">{i+1}</span>
                            </div>
                        ))}
                    </div>
                </div>


          {/* Urgent Tasks */}
          <div className="bg-white p-4 rounded-xl shadow-sm flex-grow">
            <h2 className="text-lg font-semibold mb-4">Urgent Tasks</h2>
            <div className="space-y-4">
              {urgentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{task.title}</span>
                  <span className="text-sm text-gray-500">{task.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-xl shadow-sm flex-grow">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <Clipboard className="h-6 w-6 mb-2 text-green-600" />
                  <span className="text-sm font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
          
            </div>
            
        </section>

    )
}