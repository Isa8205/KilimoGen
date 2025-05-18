import { PrimaryGeneratedColumn, Entity, Column, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { Season } from "./Seasons";
import { Delivery } from "./Delivery";
@Entity('harvests', {name: "Harvest"})
export class Harvest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({nullable: true})
    target: number;

    @ManyToOne(() => Season, season => season.harvests)
    season: Season

    @OneToMany(() => Delivery, deliveries => deliveries.harvest)
    deliveries: Delivery[]

}