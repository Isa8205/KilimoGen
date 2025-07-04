import { User } from "@/main/database/src/entities/auth/User";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("roles", {name: "Role"})
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({default: false})
    isDeleted: boolean;

    @OneToMany(() => User, user => user.role)
    users: User[];
}