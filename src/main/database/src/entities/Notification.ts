import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('notifications', {name: "Notification"})
export class Notification {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    category: string

    @Column()
    message: string

    @Column()
    date: Date

    @Column()
    seen: boolean
}