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

    @Column({nullable: true, default: null})
    endDate: Date;

    @Column({nullable: true})
    target: number;

    @Column({nullable: true})
    description: string;

    @ManyToOne(() => Season, season => season.harvests)
    season: Season

    @OneToMany(() => Delivery, deliveries => deliveries.harvest)
    deliveries: Delivery[]

}