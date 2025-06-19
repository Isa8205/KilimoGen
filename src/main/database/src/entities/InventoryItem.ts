import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { Clerk } from "./Clerk";

@Entity('inventory_items', { name: "InventoryItem" })
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    itemName: string;

    @Column()
    category: string;

    @Column()
    unit: "ml" | "kgs" | "bags";

    @Column()
    unitWeight: string;

    @Column({ length: 150, nullable: true })
    description: string;

    @Column()
    dateReceived: Date;

    @ManyToOne(() => Clerk)
    receivedBy: Clerk;

    @Column({nullable: true})
    image: string;

}