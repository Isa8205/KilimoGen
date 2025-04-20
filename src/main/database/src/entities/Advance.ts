import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from "typeorm";
import { Farmer } from "./Farmer";
import { Clerk } from "./Clerk";

@Entity("advances", {name: 'Advance'})
export class Advance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column()
    dateGiven: Date;

    @Column()
    dateExpected: Date;

    @Column()
    clerkId: number

    @ManyToOne(() => Clerk)
    clerk: Clerk

    @Column()
    farmerId: number;

    @ManyToOne(() => Farmer, farmer => farmer.advances)
    farmer: Farmer;

}