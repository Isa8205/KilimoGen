import {
  ChevronLeftCircle,
  ChevronRightCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { formatMonth, generateCalendarDays, getFirstDayOfMonth } from "@/utils/CalendarDays";
import Modal from "../Modal/Modal";
import { formatDate } from "date-fns";
import EventAddModalContent from "./EventAddModal";

// Simple event interface
interface Event {
  title: string;
  date: string;
  description: string;
}

const Calendar: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<Event[]>([]);
  const [modalDisp, setModalDisp] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get the current month's days and the first day of the month
  const daysInMonth = generateCalendarDays(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Get events for the current month in the db
  const fetchEvents = async () => {
    try {
      const response = await window.electron.invoke("get-events", {
        month: currentMonth + 1,
        year: currentYear,
      });
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date): Event[] => {
    if (!events) return [];
    return events.filter((event) => event.date === day.toISOString().slice(0, 10).split("-").reverse().join("-"));
  };

  useEffect(() => {
    fetchEvents();
  }, [currentMonth, currentYear]);

  return (
    <div className="">
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
          const dayEvents = getEventsForDay(day)

          return (
            <div
              key={index}
              aria-label={`Day ${day.getDate()}`}
              className={`flex flex-col justify-start items-end pb-6 pr-2 border cursor-pointer relative ${
                today.toDateString() === day.toDateString()
                  ? "border-2 border-orange-300 border-l-0"
                  : "bg-white"
              }`}
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
                      {event.title}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for adding events */}
      <Modal 
      title={`Add event for ${formatDate(selectedDate as Date, "dd/MMM/yyyy")}`}
      isOpen={modalDisp}
      onClose={() => {
        setModalDisp(false);
        setSelectedDate(null);
      }}
      >
        <EventAddModalContent 
        selectedDate={selectedDate}
        onClose={() => {
          setModalDisp(false);
          setSelectedDate(null);
        }}
        />
      </Modal>
    </div>
  );
};

export default Calendar;
