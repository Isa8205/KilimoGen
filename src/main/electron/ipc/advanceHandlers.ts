import { AppDataSource } from "@/main/database/src/data-source";
import { Advance } from "@/main/database/src/entities/Advance";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { Farmer } from "@/main/database/src/entities/Farmer";
import { ipcMain } from "electron";

export default function registerAdvanceHandlers() {
    ipcMain.handle("advance:add-for-farmer", async(_event, data) => {
        try {
        const advanceRepository = AppDataSource.getRepository(Advance)
        const farmerRepository = AppDataSource.getRepository(Farmer)
        const clerkRepository = AppDataSource.getRepository(Clerk)
        const advance = new Advance

        advance.farmer = await farmerRepository.findOneBy({id: data.farmerId})
        advance.clerk = await clerkRepository.findOneBy({id: data.clerkId})
        advance.amount = data.amount
        advance.dateGiven = new Date()
        advance.dateExpected = new Date(data.dateExpected)
        advance.reason = data.reason
        advance.status = "Pending"

        await advanceRepository.save(advance)
        return {passed: true, message: "Advance saved successfully"}
        } catch (err) {
            console.error("Failed to save advance", err)
            return {passed: false, message: "Encountered an error. Please try again."}
        } 
    })
}