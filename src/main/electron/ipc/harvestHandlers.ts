import { AppDataSource } from "@/main/database/src/data-source";
import { Harvest } from "@/main/database/src/entities/Harverst";
import { Season } from "@/main/database/src/entities/Seasons";
import { ipcMain } from "electron";

function registerHarvestHandlers() {
  ipcMain.handle("get-harvests", async () => {
    const harvestRepository = AppDataSource.getRepository(Harvest);
    const harvests = await harvestRepository.find({
      relations: ["season"],
    });
    return harvests;
  });
  
  ipcMain.handle("add-harvest", async (event, harvestData) => {
    const { name, startDate, endDate, seasonId, target, description } =
      harvestData;
    const harvestRepository = AppDataSource.getRepository(Harvest);
    const seasonRepository = AppDataSource.getRepository(Season);

    const harvest = new Harvest();
    harvest.name = name;
    (harvest.season as any) = await seasonRepository.findOneBy({
      id: parseInt(seasonId),
    });
    harvest.startDate = startDate;
    harvest.endDate = endDate;
    harvest.target = target;

    try {
      await harvestRepository.save(harvest);
      const res = { passed: true, message: "Harvest added successfully" };
      return res;
    } catch (err) {
      console.error(err);
      const res = { passed: false, message: "Failed. Try again", error: err };
      return res;
    }
  });
}

export default registerHarvestHandlers