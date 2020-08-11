import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Unique, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Store } from "../../../../stores/infra/typeorm/entities/Store";
import { Driver } from "../../../../drivers/infra/typeorm/entities/Driver";
import { Package } from "./Package";

@Entity('delivers')
export class Deliver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column()
  amount: number;

  @Column()
  store_id: string;

  @Column()
  driver_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(type => Package, pack => pack.deliver_id)
  packages: Package[]

  @ManyToOne(type => Store, store => store.delivers, { cascade: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(type => Driver, driver => driver.delivers)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;
}