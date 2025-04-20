import { Column, DeleteDateColumn, Entity } from "typeorm";

@Entity('sessions', {name: 'Season'})
export class Session {
    @Column({primary: true})
    id: string

    @Column({type: 'varchar'})
    data: string

    @DeleteDateColumn()
    deletedAt: Date
}