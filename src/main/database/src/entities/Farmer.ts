import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
} from "typeorm";
import { Delivery } from "./Delivery";
import { Advance } from "./Advance";

@Entity('farmers', {name: "Farmer"})
export class Farmer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  lastName: string;

  @Column({ type: "int" })
  farmerNumber: number;

  @Column("int")
  phone: number;

  @Column({ unique: true })
  email: string;

  @Column({
    type: "int",
    unique: true,
    nullable: false,
  })
  nationalID: number;

  @Column({ nullable: true })
  coordinates: string;

  @Column()
  crop: string;

  @OneToMany(() => Delivery, (deliveries) => deliveries.farmer)
  deliveries: Delivery[];

  @OneToMany(() => Advance, advances => advances.farmer)
  advances: Advance;

  @Column({ type: "varchar", nullable: false })
  paymentMode: string;

  @Column({type: 'varchar', nullable: true })
  avatar: string | null;

  // Custom field not in the databased
  totalDeliveries: number | null
}