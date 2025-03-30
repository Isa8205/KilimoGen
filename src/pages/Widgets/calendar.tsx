import axios from 'axios';
import {
  CalendarDays,
  ChevronLeftCircle,
  ChevronRightCircle,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';

// Utility function to generate the days of the current month
const generateCalendarDays = (year: number, month: number) => {
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
  const [modalDisp, setModalDisp] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const EventAddModal = () => {
    const handleSubmit = async (e) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())

      const response = await axios.post('http://localhost:3000/api/calendar/add-event', {...data, date: selectedDate})
      console.log(response)
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black z-50">
        <ToastContainer />
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg w-full max-w-md"
        >
          {/* Dialog Header */}
          <div className="border-b p-4">
            <span className="flex items-center justify-between">
              <h2 className="text-lg font-semibold inline-flex gap-3">
                <CalendarDays /> Add New Event for{' '}
                {selectedDate?.toDateString()}
              </h2>
              <X
                className="bg-gray-100 cursor-pointer hover:bg-red-500 hover:text-white rounded-sm"
                onClick={() => setModalDisp(false)}
              />
            </span>
            <p className="text-sm text-gray-600">
              Enter the details for the new Event.
            </p>
          </div>

          {/* Dialog Content */}
          <div className="p-4">
            <div className="flex flex-col gap-2 items-stretch">
              {/* FarmerNumber Input */}
              <div className="inline-flex flex-col items-start  justify-stretch">
                <label
                  htmlFor="event-name"
                  className="text-right font-medium text-sm text-gray-700"
                >
                  Event Name
                </label>
                <input
                  required
                  type="text"
                  id="event-name"
                  name="title"
                  className="col-span-3 p-2 border rounded-md focus:outline-none "
                />
              </div>

              <div className="flex justify-between">
                {/* StartTime Input */}
                <div className="flex flex-col">
                  <label
                    htmlFor="end-time"
                    className="text-right font-medium text-sm text-gray-700"
                  >
                    Start Time
                  </label>
                  <input className='col-span-3 p-2 border rounded-md focus:outline-none ' type="time" name='startTime' id='end-time' />
                </div>

                {/* EndTime Input */}
                <div className="flex flex-col">
                  <label
                    htmlFor="end-time"
                    className="text-right font-medium text-sm text-gray-700"
                  >
                    End Time
                  </label>
                  <input type="time" className='col-span-3 p-2 border rounded-md focus:outline-none ' name='endtime' id='end-time' />
                </div>
              </div>

              {/* Quantity Input */}
              <div className="flex flex-col items-start">
                <label
                  htmlFor="quantity"
                  className="text-right font-medium text-sm text-gray-700"
                >
                  Venue
                </label>
                <select className='col-span-3 p-2 border rounded-md focus:outline-none' name="location" id="event-location">
                  <option value="Dome">Dome</option>
                  <option value="Hall">Hall</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="border-t p-4 flex justify-end">
            <button className="bg-gray-100 text-gray-600 border-2 border-accent hover:text-white py-2 px-4 rounded-md hover:bg-accent focus:outline-none">
              Add Delivery
            </button>
          </div>
        </form>
      </div>
    );
  };

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<string>('');

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
      {modalDisp && <EventAddModal />}
      <header className="text-center mb-4">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-semibold">
            {formatMonth(currentMonth)} {currentYear}
          </div>
          <div className="inline-flex gap-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md border"
              onClick={() => {
                setCurrentMonth(today.getMonth());
                setCurrentYear(today.getFullYear());
              }}
            >
              Today
            </button>
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
              style={{
                background:
                  day.toDateString() === today.toDateString() ? '#fbbf24' : '',
              }}
              className="flex flex-col justify-start items-end pb-6 pr-2 border bg-white cursor-pointer hover:bg-orange-50 relative"
              onClick={() => {
                setSelectedDate(day);
                setModalDisp(true);
              }}
            >
              <div className="text-xl font-thin">{day.getDate()}</div>
              <div className="text-xs text-gray-600">
                {dayEvents.map((event, idx) =>
                  idx < 2 ? (
                    <div key={idx} className="bg-green-200 p-1 rounded-md mt-1">
                      {event.description}
                    </div>
                  ) : null,
                )}
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
