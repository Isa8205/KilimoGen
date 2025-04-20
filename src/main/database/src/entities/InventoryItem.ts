import { PrimaryGeneratedColumn, Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { Clerk } from "./Clerk";

@Entity('inventory', { name: "InventoryItem" })
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    productName: string;

    @Column()
    category: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ length: 150, nullable: true })
    description: string;

    @Column({ nullable: true })
    weight: number;

    @Column()
    dateReceived: Date;

    @ManyToOne(() => Clerk)
    receivedBy: Clerk;

    @Column({nullable: true})
    Image: string;
}