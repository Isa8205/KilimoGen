import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from "typeorm";
import { Harvest } from "./Harverst";

@Entity('seasons', {name: 'Season'})
export class Season {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    startDate: number;

    @Column()
    endDate: number;

    @Column({nullable: true})
    target: number;

    @Column({nullable: true})
    description: string;

    @OneToMany(() => Harvest, harverst => harverst.season)
    harversts: Harvest;
}