import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity('clerks', {name: "Clerk"})
export class Clerk {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 20})
    firstName: string

    @Column({length: 20, nullable: true})
    middleName: string

    @Column({nullable: true})
    lastName: string

    @Column({unique: true})
    username: string

    @Column({nullable: false})
    gender: string

    @Column({unique: true})
    phone: number

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @Column({nullable: true})
    avatar: string
}