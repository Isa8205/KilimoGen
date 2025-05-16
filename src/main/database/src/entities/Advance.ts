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
    reason: string

    @Column()
    dateGiven: Date;

    @Column()
    dateExpected: Date;

    @Column({type: 'varchar'})
    status: 'Paid' | 'Pending approval' | 'Pending' | 'OverDue'

    @ManyToOne(() => Clerk)
    clerk: Clerk | null

    @ManyToOne(() => Farmer, farmer => farmer.advances)
    farmer: Farmer | null

}