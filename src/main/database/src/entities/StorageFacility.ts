import { Clerk } from "@/main/database/src/entities/Clerk";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("stores", {name: "StorageFacility"})
export class StorageFacility {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    sections: String;
    
    @Column()
    description: string;

    @Column()
    createdAt: Date;
    
    @ManyToOne(() => Clerk, (clerk) => clerk.id, { nullable: false, onDelete: "NO ACTION" })
    asignee: Clerk;
}