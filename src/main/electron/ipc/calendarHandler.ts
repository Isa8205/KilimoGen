import { AppDataSource } from "@/main/database/src/data-source";
import { CalendarEvent } from "@/main/database/src/entities/Event";
import { ipcMain, IpcMainInvokeEvent } from "electron";
import { Like } from "typeorm";

interface EventDataParams  {
  day?: string;
  month?: number;
  year?: number;
}
export const registerCalenderHandlers = () => {
  ipcMain.handle("get-events", async(__event, eventData: EventDataParams) => {
    try {
      const eventRepository = AppDataSource.getRepository(CalendarEvent)
      const test = await eventRepository.find()

      if (eventData.day) {
        const data = await eventRepository.find({where: {date: eventData.day}})
        
        return {passed: true, data: data || []}
      }
      const dateEnding = `0${eventData.month}-${eventData.year}`
      const data = await eventRepository.find({where: {date: Like(`%${dateEnding}`)}})

      return {passed: true, data: data}
    } catch (err) {
      console.error('Error getting events: ', err)
      return {passed: false, data: []}
    }
  })
  ipcMain.handle("add-event", async (_event: IpcMainInvokeEvent, eventData) => {
    try {
      const date = new Date(eventData.date)
      const venue =
        eventData.location === "other"
          ? eventData.otherLocation || "Unknown"
          : eventData.location;

      const eventRepository = AppDataSource.getRepository(CalendarEvent);
      const event = eventRepository.create({
        ...eventData, ['venue']: venue, ['date']: date.toISOString().slice(0,10).split('-').reverse().join('-')      
      })

      await eventRepository.save(event)
      return { passed: true, message: "Event saved successfully" };
    } catch (err) {
      return {
        passed: false,
        message: `Failed. Encountered this error: ${err}`,
      };
    }
  });
};
