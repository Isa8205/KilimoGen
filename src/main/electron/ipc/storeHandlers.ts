import { AppDataSource } from "@/main/database/src/data-source";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { StorageFacility } from "@/main/database/src/entities/StorageFacility";
import { ipcMain } from "electron";

export default function registerStoreHandlers(user: any) {
    const storesRepository = AppDataSource.getRepository(StorageFacility)
    const clerkRepository = AppDataSource.getRepository(Clerk)

    ipcMain.handle("stores:get-all", async() => {
        const dbData = await storesRepository.find({ relations: ["asignee"] })
        const resData = dbData.map((store) => {
            return {
                ...store,
                sections: store.sections.split(";"),
                asignee: store.asignee?.firstName || "Unassigned"
            }
        })
        return { passed: true, data: resData }
    })

    ipcMain.handle("stores:add", async(_event, data, user) => {
        try {
            const { name, sections, description, asigneeId } = data

            const newStore = new StorageFacility
            newStore.name = name
            newStore.sections = sections.join(";")
            newStore.createdAt = new Date()
            newStore.description = description;
            (newStore.asignee as Clerk | null)  = await clerkRepository.findOneBy({ id: Number(asigneeId) })

            await storesRepository.insert(newStore)
            return { passed: true, message: "Store added sucessfully"}
        } catch (err) {
            console.error(err)
            return { passed: false, message: "Encountered and error! Please try again"}
        }
    })
}