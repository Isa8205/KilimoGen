import {
  CalendarDays,
  ChevronLeftCircle,
  ChevronRightCircle,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import notify from "../utils/ToastHelper";

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

  interface EventAddModalProps {
    selectedDate: Date | null;
    setModalDisp: (state: boolean) => void;
  }

  const EventAddModal: React.FC<EventAddModalProps> = ({
    selectedDate,
    setModalDisp,
  }) => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = (Object as any).fromEntries(formData);

      const eventData = {
        ...data,
        date: selectedDate,
      };

      const response = await window.electron.invoke("add-event", eventData);

      if (response) {
        console.log(response);
        notify(response.passed, response.message);
        setTimeout(() => {
          setModalDisp(false);
        }, 2000);
      } else {
        notify(response.passed, response.message);
      }
    };

    const [dayEvents, setDayEvents] = useState<{
      id: number;
      title: string;
      startTime: Date;
      endTime: Date;
      description: string;
      time: string;
      venue: string;
    }[]>([]);
    useEffect(() => {
      const getDayEvents = async () => {
        const response = await window.electron.invoke("get-events", {day: selectedDate?.toISOString().slice(0,10).split('-').reverse().join('-')});

        if (response.data.length > 0) {
          const data = response.data.map(
            (event: {
              id: number;
              title: string;
              startTime: Date;
              endTime: Date;
              description: string;
            }) => {
              const time = `${event.startTime} - ${event.endTime}`;
              return { ...event, ["time"]: time };
            }
          );

          setDayEvents(data)
        }
      };
      getDayEvents()
    }, []);

    const [isOtherVenue, setOtherVenue] = useState<boolean | null>(false);

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black z-50 p-4">
        <ToastContainer />
        <div className="bg-white rounded-lg shadow-lg w-fit max-w-4xl flex">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-1 p-5 border-r-2">
            {/* Dialog Header */}
            <div className="border-b pb-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5" /> Add New Event for{" "}
                {selectedDate?.toDateString()}
              </h2>
              <button
                type="button"
                className="bg-gray-100 p-1 rounded-md hover:bg-red-500 hover:text-white"
                onClick={() => setModalDisp(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="py-4 space-y-4">
              {/* Event Name Input */}
              <div>
                <label
                  htmlFor="event-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Name
                </label>
                <input
                  required
                  type="text"
                  id="event-name"
                  name="title"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Description Input */}
              <div>
                <label
                  htmlFor="event-description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="event-description"
                  name="description"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={3}
                ></textarea>
              </div>

              {/* Start and End Time Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="start-time"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="start-time"
                    name="startTime"
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="end-time"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id="end-time"
                    name="endTime"
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Venue Selection */}
              <div>
                <label
                  htmlFor="event-location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Venue
                </label>
                <select
                  onChange={(e) =>
                    e.currentTarget.value === "other"
                      ? setOtherVenue(true)
                      : setOtherVenue(false)
                  }
                  id="event-location"
                  name="location"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">--- Select ---</option>
                  <option value="Dome">Dome</option>
                  <option value="Hall">Hall</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Other venue */}
              {isOtherVenue && (
                <div>
                  <label
                    htmlFor="other-event-location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Venue
                  </label>
                  <input
                    id="event-location"
                    name="other-location"
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="border-t pt-4 flex justify-end">
              <button
                type="submit"
                className="bg-accent text-white py-2 px-4 rounded-md hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Add Event
              </button>
            </div>
          </form>

          {dayEvents.length > 0 && (
            <div className="flex-1 p-5 overflow-y-auto">
              <h3 className="text-lg p-2 font-semibold mb-3">
                Events for {selectedDate?.toDateString()}
              </h3>
              <div className="space-y-3">
                {dayEvents.map((event, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-md shadow-sm bg-gray-50"
                  >
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.time}</p>
                    <p className="text-sm text-gray-600">
                      Venue: {event.venue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events List Section */}
        </div>
      </div>
    );
  };

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<string>("");

  // Get the current month's days and the first day of the month
  const daysInMonth = generateCalendarDays(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Add event to the selected day
  const handleAddEvent = () => {
    if (selectedDate && newEvent.trim() !== "") {
      const newEventObj: Event = {
        date: selectedDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        description: newEvent,
      };
      setEvents([...events, newEventObj]);
      setNewEvent("");
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(
      (event) => event.date === day.toISOString().split("T")[0]
    );
  };

  // Format month name
  const formatMonth = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  };

  return (
    <div className="">
      {modalDisp && (
        <EventAddModal
          selectedDate={selectedDate}
          setModalDisp={setModalDisp}
        />
      )}
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
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
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
                  day.toDateString() === today.toDateString() ? "#fbbf24" : "",
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
                  ) : null
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
    </div>
  );
};

export default Calendar;
