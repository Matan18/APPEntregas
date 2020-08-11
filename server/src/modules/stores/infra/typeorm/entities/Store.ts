import { Entity, Column, PrimaryColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Deliver } from "../../../../delivers/infra/typeorm/entities/Deliver";
import { Driver } from "../../../../drivers/infra/typeorm/entities/Driver";

@Entity()
export class Store {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(type => Driver, driver => driver.store)
  drivers: Driver[];

  @OneToMany(type => Deliver, deliver => deliver.store)
  delivers: Deliver[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}