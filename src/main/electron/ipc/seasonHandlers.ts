import { AppDataSource } from "@/main/database/src/data-source";
import { Season } from "@/main/database/src/entities/Seasons";
import { ipcMain } from "electron";

function registerSeasonHandlers() {
  const seasonRepository = AppDataSource.getRepository(Season);

  ipcMain.handle("seasons:get-all", async () => {
    try {
      const seasonRepository = AppDataSource.getRepository(Season);
      // const seasons = await seasonRepository
      //   .createQueryBuilder("season")
      //   .leftJoinAndSelect("season.harverst", "harvests")
      //   .select(["season.id", "season.name"])
      //   .orderBy("season.startDate", "ASC")
      //   .getMany();

        const seasons = await seasonRepository.find({relations: ['harvests']})

      const res = { seasons: seasons };
      return res;
    } catch (err) {
      console.log(err);
      return [];
    }
  });

  ipcMain.handle("seasons:add", async (event, seasonData) => {
    try {
      const lastSeason = await seasonRepository.createQueryBuilder("season").where("season.endDate IS NULL").orderBy("season.startDate", "DESC").getOne();
      if (lastSeason && lastSeason.endDate === null) {
        lastSeason.endDate = new Date()
        await seasonRepository.save(lastSeason)
      }
      const season = new Season();
      season.name = seasonData.seasonName;
      season.startDate = seasonData.startDate;
      season.endDate = seasonData.endDate ? seasonData.endDate : null;
      season.target = seasonData.target;
      season.description = seasonData.description;

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
