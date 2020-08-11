import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Deliver } from "./Deliver";

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @ManyToOne(type => Deliver, deliver => deliver.packages, { cascade: true })
  deliver: Deliver
}