import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Clerk } from "./Clerk";
import { InventoryTransaction } from "@/main/database/src/entities/InventoryTransaction";

@Entity('inventory_items', { name: "InventoryItem" })
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    itemName: string;

    @Column()
    category: string;

    @Column()
    quantity: number;

    @Column()
    unitWeight: number;

    @Column()
    unit: string;

    @Column()
    location: string;

    @Column()
    zone: string;

    @Column()
    supplier: string;

    @Column()
    minStock: number;

    @Column()
    maxStock: number;

    @Column()
    dateReceived: Date;

    @Column({ length: 150, nullable: true })
    description: string;

    @Column()
    batchNumber: string;

    @Column()
    origin: string;

    @Column("varchar",{ nullable: true })
    images: string;

    @ManyToOne(() => Clerk)
    receivedBy: Clerk;

    @OneToMany(() => InventoryTransaction, (transaction) => transaction.item)
    transactions: InventoryTransaction[];
}
