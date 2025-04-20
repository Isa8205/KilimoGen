import { AppDataSource } from "@/main/database/src/data-source";
import { Season } from "@/main/database/src/entities/Seasons";
import { ipcMain } from "electron";

function registerSeasonHandlers() {
  ipcMain.handle("get-seasons", async () => {
    try {
      const seasonRepository = AppDataSource.getRepository(Season);
      const seasons = await seasonRepository
        .createQueryBuilder("season")
        .select(["season.id AS id", "season.name AS name"])
        .orderBy("season.startDate", "ASC")
        .getRawMany();

      const res = { seasons: seasons };
      return res;
    } catch (err) {
      console.log(err);
      return [];
    }
  });

  ipcMain.handle("add-season", async (event, seasonData) => {
    const seasonRepository = AppDataSource.getRepository(Season);
    const season = new Season();
    season.name = seasonData.seasonName;
    season.startDate = seasonData.startDate;
    season.endDate = seasonData.endDate;
    season.target = seasonData.target;
    season.description = seasonData.description;

    try {
      await seasonRepository.save(season);
      const res = { passed: true, message: "Seson created successfuly" };
      return res;
    } catch (err) {
      console.log(err);
      const res = {
        passed: false,
        message: "Failed to create season. Try again",
      };
      return res;
    }
  });
}

export default registerSeasonHandlers;
