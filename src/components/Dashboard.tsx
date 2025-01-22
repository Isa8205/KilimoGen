import { ChevronLeft, ChevronRight, Clipboard } from 'lucide-react';

export default function Dashboard() {
  const date = new Date();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const quickActions = [
    { id: 1, title: 'Add Task' },
    { id: 2, title: 'Schedule Equipment' },
    { id: 3, title: 'Request Supply' },
    { id: 4, title: 'Report Issue' },
  ];

  const urgentTasks = [
    { id: 1, title: 'Harvesting crops', date: 'Today' },
    { id: 2, title: 'Fertilizing soil', date: 'Today' },
    { id: 3, title: 'Irrigating fields', date: 'Today' },
  ];
  return (
    <section className="text-gray-700 flex flex-row-reverse justify-between items-start flex-wrap gap-3">
      <aside className="bg-white shadow-sm p-2 rounded-md flex-grow">
        <h2 className="text-xl font-semibold mb-4">Stats</h2>

        <div className=" rounded-md flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Current Season</span>
            <span className="text-sm font-semibold">2024/25</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Cherry Production</span>
            <span className="text-sm font-semibold">2.5 tons</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Mbuni Production</span>
            <span className="text-sm font-semibold">2.5 tons</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold my-4">Top 5 Farmers</h2>
        <div className=" rounded-md flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Mary Jane</span>
            <span className="text-sm font-semibold">15 tons</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Peter Parker</span>
            <span className="text-sm font-semibold">2.5 tons</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Batman</span>
            <span className="text-sm font-semibold">2.5 tons</span>
          </div>
        </div>
      </aside>

      <div className="flex gap-3 justify-between flex-wrap">
        {/* Calendar */}
        <div className="bg-white text-black shadow-md rounded-md p-4">
          <div className="flex justify-between font-bold pb-4">
            <h2 className="text-xl">
              {months[date.getMonth()]} &nbsp; {date.getFullYear()}
            </h2>
            <span className="text-white inline-flex gap-2">
              <ChevronLeft className="bg-gray-700 text-center rounded-full" />
              <ChevronRight className="bg-gray-700 text-center rounded-full" />
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
            {[...Array(30)].map((_, i) => (
              <div className="flex justify-center">
                <span className="w-6 h-6 rounded-full text-center bg-gray-200">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex-grow">
          <h2 className="text-lg font-semibold mb-4">Urgent Tasks</h2>
          <div className="space-y-4">
            {urgentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{task.title}</span>
                <span className="text-sm text-gray-500 mx-2">{task.date}</span>
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
  );
}
