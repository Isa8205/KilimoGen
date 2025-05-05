import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import { Clerk } from "./Clerk";
import { Farmer } from "@/main/database/src/entities/Farmer";
import { Harvest } from "@/main/database/src/entities/Harverst";

@Entity('deliveries', {name: "Delivery"})
export class Delivery {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    deliveryCode: string

    @Column({type: 'date'})
    deliveryDate: string

    @Column()
    quantity: number

    @Column()
    berryType: string

    @ManyToOne(() => Clerk)
    servedBy: Clerk;

    @Column()
    farmerNumber: number;
  
    @ManyToOne(() => Farmer, farmer => farmer.deliveries)
    farmer: Farmer;

    @ManyToOne(() => Harvest, harvest => harvest.deliveries)
    harvest: Harvest;
}