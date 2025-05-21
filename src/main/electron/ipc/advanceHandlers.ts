import { AppDataSource } from "@/main/database/src/data-source";
import { Advance } from "@/main/database/src/entities/Advance";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { Farmer } from "@/main/database/src/entities/Farmer";
import { ipcMain } from "electron";

export default function registerAdvanceHandlers() {
    ipcMain.handle("advance:get-all", async () => {
        try {
            const advanceRepository = AppDataSource.getRepository(Advance)
            const advances = await advanceRepository.createQueryBuilder("advance")
                .leftJoinAndSelect("advance.farmer", "farmer")
                .leftJoinAndSelect("advance.clerk", "clerk")
                .select([
                    "advance.id",
                    "advance.amount",
                    "advance.dateGiven",
                    "advance.dateExpected", 
                    "advance.reason",
                    "advance.status",
                    "farmer.id",
                    "farmer.firstName",
                    "farmer.lastName",
                    "farmer.farmerNumber",
                ])
                .orderBy("advance.dateGiven", "DESC")
                .getMany()

            return {passed: true, advances: advances}
        } catch (err) {
            console.error("Failed to fetch advances", err)
            return {passed: false, message: "Encountered an error. Please try again.", advances: []}
        }
    })

    ipcMain.handle("advance:add", async (_event, data) => {
        try {
            const advanceRepository = AppDataSource.getRepository(Advance)
            const farmerRepository = AppDataSource.getRepository(Farmer)
            const clerkRepository = AppDataSource.getRepository(Clerk)
            
            const farmer = await farmerRepository.findOneBy({id: data.farmerNumber})
            if (!farmer) {
                return {passed: false, message: "Farmer not found"}
            }
            const clerk = await clerkRepository.findOneBy({id: data.clerkId})
            if (!clerk) {
                return {passed: false, message: "You should be logged in to perform this action"}
            }

            const advance = new Advance
            advance.farmer = await farmerRepository.findOneBy({id: data.farmerNumber})
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