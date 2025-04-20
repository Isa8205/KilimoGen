import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";   

@Entity('events', {name: "Event"})
export class CalendarEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({type: 'date'})
    date: Date | string;

    @Column()
    startTime: string;

    @Column()
    endTime: string;

    @Column()
    venue: string;

    @Column()
    description: string;
}