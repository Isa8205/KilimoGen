import { AppDataSource } from "@/main/database/src/data-source";
import { Clerk } from "@/main/database/src/entities/Clerk";
import { Delivery } from "@/main/database/src/entities/Delivery";
import { Farmer } from "@/main/database/src/entities/Farmer";
import { Harvest } from "@/main/database/src/entities/Harverst";
import { getSession } from "@/main/electron/session/sessinStore";
import generateCode from "@/main/utils/codeGenerator";
import printReceipt from "@/main/utils/printReceipt";
import { ipcMain } from "electron";

export default function registerDeliveryHandlers() {
  ipcMain.handle("get-deliveries", async (event, data) => {
      const filter = data.filter
      const sort = data.sortType || "desc";
      const page = parseInt(data.page) || 1;
      const itemsPerPage = parseInt(data.limit) || 20;
    
      try {
        const query = AppDataSource.getRepository(Delivery)
          .createQueryBuilder("delivery")
          .leftJoinAndSelect("delivery.farmer", "farmer")
          .leftJoinAndSelect("delivery.servedBy", "clerks")
          .select([
            "delivery.id",
            "delivery.deliveryCode",
            "delivery.deliveryDate",
            "delivery.quantity",
            "delivery.berryType",
            "delivery.servedBy",
            "farmer.id",
            "farmer.firstName",
            "farmer.lastName",
            "clerks.id",
            "clerks.firstName",
            "clerks.lastName",
          ])
          .orderBy("delivery.deliveryDate", "DESC")
          .skip((page - 1) * itemsPerPage)
          .take(itemsPerPage)
          .orderBy("delivery.deliveryDate", sort === "asc" ? "ASC" : "DESC");
    
        if (filter && filter !== "All") {
          query.andWhere("delivery.berrytype = :filter", { filter });
        }
    
        const deliveries = await query.getManyAndCount();
    
    
        // Get total count of deliveries for correct paginatio
        const totalPages = Math.ceil(deliveries[1] / itemsPerPage);
    
        const res = {
          passed: true,
          deliveries: deliveries[0],
          totalPages: totalPages,
        };
        return res
      } catch (err) {
        console.log(err);
        const res = { passed: false };
        return res
      }
    
  })
  ipcMain.handle("add-delivery", async (event, deliveryData) => {
    const farmerRepository = AppDataSource.getRepository(Farmer);
    const deliveryRepository = AppDataSource.getRepository(Delivery);
    const harvestRepository = AppDataSource.getRepository(Harvest);
    const clerkRepository = AppDataSource.getRepository(Clerk);

    const clerkId = deliveryData.servedBy;
    const servedBy = await clerkRepository.findOneBy({ id: clerkId });
    if (!servedBy) {
      const res = { passed: false, message: "You should be logged in!" };
      return res;
    }

    try {
      const farmerNumber = parseInt(deliveryData.farmerNumber);
      const farmer = await farmerRepository.findOneBy({ farmerNumber: farmerNumber });
      const harverst = await harvestRepository.findOneBy({ id: 1 });
      const delivery = new Delivery();
      let message: string, passed: boolean;
      const date = new Date()

      if (farmer) {
        delivery.deliveryCode = generateCode(),
        delivery.deliveryDate = date.toISOString();
        delivery.quantity = parseInt(deliveryData.quantity);
        delivery.berryType = deliveryData.berryType;
        delivery.farmerNumber = farmerNumber;
        delivery.farmer = farmer;
        delivery.servedBy = servedBy;
        (delivery.harvest as any) = harverst;

        await deliveryRepository.save(delivery);
        const farmerDeliveries = await farmerRepository.createQueryBuilder("farmer").leftJoinAndSelect('farmer.deliveries', 'deliveries').where("farmer.farmerNumber = :farmerNumber").setParameter('farmerNumber', farmerNumber).getOne()
        const receiptData = {
          date: delivery.deliveryDate.slice(0,10).split('-').reverse().join('-'),
          time: `${date.getHours()}:${date.getMinutes()}`,
          servedBy: delivery.servedBy.firstName,
          farmerName: `${delivery.farmer.firstName} ${delivery.farmer.lastName}`,
          farmerNumber: farmer.farmerNumber,
          berryType: delivery.berryType,
          weight: delivery.quantity,
          seasonTotal: farmerDeliveries?.deliveries.reduce((acc: number, delivery: Delivery) => acc + delivery.quantity, 0)
        };

        printReceipt(receiptData)
        passed = true;
        message = "Delivery added successfully";
      } else {
        passed = false;
        message = "Farmer not found";
      }

      const res = {
        passed: passed,
        data: delivery,
        message: message,
      };
      return res;
    } catch (err) {
      console.log(err);
      const res = { passed: false, error: err, message: "Failed. Try again" };
      return res;
    }
  });
}
