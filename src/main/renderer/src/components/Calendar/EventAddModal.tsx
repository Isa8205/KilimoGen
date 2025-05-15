import notify from "@/utils/ToastHelper";
import { CalendarDays, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";

interface EventAddModalProps {
    selectedDate: Date | null;
    setModalDisp: (state: boolean) => void;
}

const EventAddModal: React.FC<EventAddModalProps> = ({
    selectedDate,
    setModalDisp,
}) => {
    const [dayEvents, setDayEvents] = useState<
      {
        id: number;
        title: string;
        startTime: Date;
        endTime: Date;
        description: string;
        time: string;
        venue: string;
      }[]
    >([]);
    const formRef = useRef<HTMLFormElement>(null)!;
    
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
        notify(response.passed, response.message);
        setTimeout(() => {
          setModalDisp(false);
        }, 2000);
      } else {
        notify(response.passed, response.message);
      }
    };

    useEffect(() => {
      ( async () => {
        const response = await window.electron.invoke("get-events", {
          day: selectedDate
            ?.toISOString()
            .slice(0, 10)
            .split("-")
            .reverse()
            .join("-"),
        });

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

          setDayEvents(data);
        }
      })();
    }, []);

    const [isOtherVenue, setOtherVenue] = useState<boolean | null>(false);

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black z-50 p-4">
        <ToastContainer />
        <div className="bg-white rounded-lg shadow-lg p-2 w-fit max-w-4xl flex flex-col">
          <div className=" border-b flex justify-between items-center py-2 ">
            <h2 className="text-lg font-semibold inline-flex items-center gap-2">
              <CalendarDays className="w-5 h-5" /> Add New Event for{" "}
              {selectedDate?.toDateString()}
            </h2>
            <button
              type="button"
              className="bg-gray-100 p-1 mt-0 rounded-md hover:bg-red-500 hover:text-white"
              onClick={() => setModalDisp(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-start ">
            {/* Form Section */}
            <form ref={formRef} onSubmit={handleSubmit} className="flex-1 p-5 border-r-2">
              {/* Dialog Header */}

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
                      name="otherLocation"
                      className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                )}
              </div>
            </form>

            {/* Events List Section */}
            {dayEvents.length > 0 && (
              <div className="p-3">
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {dayEvents.map((event, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-md shadow-sm bg-gray-50"
                    >
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-gray-600">
                        Time: {event.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        Venue: {event.venue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dialog Footer */}
          <div className="border-t pt-4 flex justify-end">
            <button
              onClick={() => formRef.current ? formRef.current.requestSubmit() : null}
              type="submit"
              className="bg-accent text-white py-2 px-4 rounded-md hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Add Event
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default EventAddModal