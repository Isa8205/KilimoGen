import { AppDataSource } from "@/main/database/src/data-source";
import { Delivery } from "@/main/database/src/entities/Delivery";
import { Farmer } from "@/main/database/src/entities/Farmer";
import { getImageBase64 } from "@/main/utils/getImageBase64";
import { saveFile } from "@/main/utils/saveFile";
import { ipcMain } from "electron";

export const registerFarmerHandlers = () => {
  ipcMain.handle("get-farmers", async (event, data) => { 
    try {
      const page = data.page || 1;
      const itemsPerPage = data.itemsPerPage || 10;

      const dbFarmes = await AppDataSource.getRepository(Farmer)
        .createQueryBuilder("farmer")
        .leftJoinAndSelect("farmer.deliveries", "deliveries")
        .select([
          "farmer.id",
          "farmer.firstName",
          "farmer.lastName",
          "farmer.phone",
          "farmer.avatar",
          "deliveries.quantity",
          "deliveries.berryType",
        ])
        .orderBy("farmer.id", "ASC")
        .skip((page - 1) * itemsPerPage) 
        .take(itemsPerPage)
        .getMany();

      const newData = dbFarmes.map((farmer) => {
        if (farmer.avatar) {
          farmer.avatar = getImageBase64(farmer.avatar, process.env.SECRET_KEY!)
        }

        if (farmer.deliveries) {
          const totalDeliveries = farmer.deliveries.reduce(
            (acc: number, delivery: Delivery) => acc + delivery.quantity,
            0
          );
          farmer.totalDeliveries = totalDeliveries;
          farmer.deliveries = []; // Clear deliveries array
        }

        return farmer;
      });

      // Correct totalPages calculation
      const totalFarmers = await AppDataSource.getRepository(Farmer).count()
      const totalPages = Math.ceil(totalFarmers / itemsPerPage);

      const res =  {
        farmers: newData,
        totalFarmers: totalFarmers,
        totalPages: totalPages, // Fix key name to match frontend
      };

      return res
    } catch (error) {
      console.error("Error during processing:", error);
      return { failed: true, message: "An error occured! Please relfresh." };
    }
  });

  ipcMain.handle("add-farmer", async (event, data) => {
    try {
      const {
        firstName,
        lastName,
        middleName,
        email,
        phone,
        nationalID,
        crop,
        paymentMode,
        avatar,
      } = data.farmerDetails;

      const farmerRepository = AppDataSource.getRepository(Farmer);
      const farmer = new Farmer();
      const farmerNumber = await farmerRepository.maximum("farmerNumber")

      farmer.firstName = firstName;
      farmer.lastName = lastName;
      farmer.middleName = middleName;
      farmer.email = email;
      farmer.phone = phone;
      farmer.nationalID = nationalID;
      farmer.crop = crop;
      farmer.paymentMode = paymentMode;
      farmer.farmerNumber = farmerNumber! + 1
      
      if (avatar.data.length > 0) {
          farmer.avatar = saveFile(avatar, "data/Farmers");
      }
      await farmerRepository.save(farmer);
      return { passed: true, message: "Farmer saved successfully" };
    } catch (err) {
      console.error(err);
      return { passed: false, message: "Failed. Please try again" };
    }
  });
};
