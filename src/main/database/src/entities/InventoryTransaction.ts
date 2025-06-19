import { Clerk } from "@/main/database/src/entities/Clerk";
import { InventoryItem } from "@/main/database/src/entities/InventoryItem";
import { Entity, Index, PrimaryColumn, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("inventory_transactions", {name: "InventoryTransactions"})
export class InventoryTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  updateType: "restock" | "allocation";

  @Column({ type: 'varchar', length: 255 })
  note: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => InventoryItem, (item) => item.id, { nullable: false, onDelete: 'CASCADE' })
  item: InventoryItem;

  @ManyToOne(() => Clerk, (clerk) => clerk.id, { nullable: false, onDelete: "NO ACTION" })
  clerk: Clerk;
}