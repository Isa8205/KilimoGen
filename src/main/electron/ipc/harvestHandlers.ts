import { AppDataSource } from "@/main/database/src/data-source";
import { Harvest } from "@/main/database/src/entities/Harverst";
import { Season } from "@/main/database/src/entities/Seasons";
import { ipcMain } from "electron";

function registerHarvestHandlers() {
  const harvestRepository = AppDataSource.getRepository(Harvest);
  const seasonRepository = AppDataSource.getRepository(Season);

  ipcMain.handle("get-harvests", async () => {
    const harvests = await harvestRepository.find({
      relations: ["season"],
    });
    return harvests;
  });

  ipcMain.handle("add-harvest", async (event, harvestData) => {
    try {
      const { name, startDate, endDate, seasonId, target, description } =
        harvestData;

      const lastHarvest = await harvestRepository
        .createQueryBuilder("harvest")
        .where("harvest.endDate IS NULL")
        .andWhere("harvest.seasonId = :seasonId", { seasonId })
        .orderBy("harvest.startDate", "DESC")
        .getOne();
      if (lastHarvest && lastHarvest.endDate === null) {
        lastHarvest.endDate = new Date();
        await harvestRepository.save(lastHarvest);
      }
      const parentSeason = await seasonRepository.findOneBy({
        id: parseInt(seasonId),
      });
      const harvest = new Harvest();
      harvest.name = name;
      harvest.season = parentSeason!;
      harvest.startDate = startDate;
        harvest.endDate = endDate ? endDate : null;
      harvest.target = target;
      harvest.description = description;

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

export default registerHarvestHandlers;
