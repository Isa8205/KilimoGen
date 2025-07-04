import { Role } from "@/main/database/src/entities/auth/Role";
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("users", {name: "User"})
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ unique: true })
    username:string;
    
    @Column()
    firstName: string;

    @Column({nullable: true})
    middleName: string;

    @Column()
    lastName: string;
    
    @Column()
    email: string;

    @Column({default: "N/A"})
    gender: string 
    
    @Column()
    password: string;

    @Column({nullable: true})
    avatar: string;

    @Column({unique: true})
    phone: number

    @ManyToOne(() => Role, role => role.users)
    @JoinTable()
    role: Role    
}