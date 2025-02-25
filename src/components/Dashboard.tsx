import DeliveriesBarChart from './Analytics';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Dashboard() {
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
    <section className="text-gray-700 p-4">
      <div className="flex justify-between items-start gap-3 mb-4 flex-wrap">
        {/* Calendar */}
        <div className="flex-grow  h-full bg-gray-100 p-5 rounded-lg shadow-lg overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            events={[
              { title: 'Meeting', start: '2024-02-25' },
              { title: 'Conference', start: '2024-02-27', end: '2024-02-29' },
            ]}
          />
        </div>

        {/* Urgent Tasks & Quick Actions */}
        <div className="flex-grow flex flex-col gap-2 justify-between">
          {/* Urgent Tasks */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Urgent Tasks</h2>
            <div className="space-y-4">
              {urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{task.title}</span>
                  <span className="text-sm text-gray-500">{task.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <span className="h-6 w-6 mb-2 text-green-600">📋</span>
                  <span className="text-sm font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Deliveries Bar Chart */}
      </div>

        <DeliveriesBarChart />
    </section>
  );
}
