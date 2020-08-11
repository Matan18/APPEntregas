import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Deliver } from "./Deliver";

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  product: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  deliver_id: string;

  @ManyToOne(type => Deliver, deliver => deliver.packages, { cascade: true })
  @JoinColumn({ name: 'deliver_id' })
  deliver: Deliver
}