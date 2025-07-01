import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Clerk } from "./Clerk";
import { InventoryTransaction } from "@/main/database/src/entities/InventoryTransaction";
import { StorageFacility } from "@/main/database/src/entities/StorageFacility";

@Entity('inventory_items', { name: "InventoryItem" })
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    itemName: string;

    @Column()
    category: string;

    @Column()
    unitWeight: number;

    @Column()
    unit: string;

    
    @Column()
    zone: string;

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

    @ManyToOne(() => StorageFacility, { nullable: true, onDelete: "SET NULL" })
    location: StorageFacility | null;

    currentQuantity: number
}
