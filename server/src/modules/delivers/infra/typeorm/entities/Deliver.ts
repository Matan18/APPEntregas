import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Store } from "../../../../stores/infra/typeorm/entities/Store";
import { Driver } from "../../../../drivers/infra/typeorm/entities/Driver";
import { Package } from "./Package";

@Entity()
export class Deliver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  amount: number;

  @ManyToOne(type => Store, store => store.delivers, { cascade: true })
  store: Store;

  @OneToMany(type => Package, pack => pack.deliver)
  packages: Package[]

  @ManyToOne(type => Driver, driver => driver.delivers)
  driver: Driver;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}