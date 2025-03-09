import {
  ChevronLeftCircle,
  ChevronRightCircle,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

// Utility function to generate the days of the current month
const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const days: Date[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  return days;
};

// Utility function to get the day of the week for the first date of the month
const getFirstDayOfMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  return firstDay.getDay(); // Sunday = 0, Monday = 1, etc.
};

// Simple event interface
interface Event {
  date: string;
  description: string;
}

const Calendar: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get the current month's days and the first day of the month
  const daysInMonth = generateCalendarDays(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Add event to the selected day
  const handleAddEvent = () => {
    if (selectedDate && newEvent.trim() !== '') {
      const newEventObj: Event = {
        date: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        description: newEvent,
      };
      setEvents([...events, newEventObj]);
      setNewEvent('');
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(
      (event) => event.date === day.toISOString().split('T')[0],
    );
  };

  // Format month name
  const formatMonth = (month: number) => {
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
    return months[month];
  };

  return (
    <div className="">
      <header className="text-center mb-4">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-semibold">
            {formatMonth(currentMonth)} {currentYear}
          </div>
          <div className='inline-flex gap-4'>
            <button
            className='px-4 py-2 bg-gray-500 text-white rounded-md border'
              onClick={() => {
                setCurrentMonth(today.getMonth());
                setCurrentYear(today.getFullYear());
              }}>Today</button>
              <span>
              <button
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-l-md border-r"
            >
              <ChevronLeftCircle />
            </button>
            <button
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-r-md border-l"
            >
              <ChevronRightCircle />
            </button>
              </span>
          </div>
        </div>
      </header>

      {/* Days of the Week Row */}
      <div className="grid grid-cols-7 text-center text-lg font-semibold">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div
            key={index}
            className="inline-flex justify-end items-start pb-6 pr-2 border bg-white"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 justify-stretch items-stretch">
        {/* Empty spaces for the days before the 1st of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={index} className="p-4 border bg-white"></div>
        ))}

        {/* Days of the month */}
        {daysInMonth.map((day, index) => {
          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={index}
              aria-label={`Day ${day.getDate()}`}
              style={{ background: day.toDateString() === today.toDateString() ? '#fbbf24' : '' }}
              className="flex flex-col justify-start items-end pb-6 pr-2 border bg-white cursor-pointer hover:bg-orange-50 relative"
              onClick={() => setSelectedDate(day)}
            >
              <div className="text-xl font-thin" >{day.getDate()}</div>
              <div className="text-xs text-gray-600">
                {dayEvents.map((event, idx) => (
                  (idx < 2) ? (
                      <div key={idx} className="bg-green-200 p-1 rounded-md mt-1">
                        {event.description}
                      </div>

                    )
                    : null
                ))}
              </div>
              {selectedDate?.toDateString() === day.toDateString() && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  <span>!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Event Form */}
      {selectedDate && (
        <div className="">
          <span onClick={() => setSelectedDate(null)}>
            <X />{' '}
          </span>
          <h3 className="text-2xl font-semibold mb-2">
            Add Event for {selectedDate.toDateString()}
          </h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="Enter event description"
              className="flex-grow p-2 border rounded-md"
            />
            <button
              onClick={handleAddEvent}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Add Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
