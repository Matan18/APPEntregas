import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Store } from "../../../../stores/infra/typeorm/entities/Store";
import { Deliver } from "../../../../delivers/infra/typeorm/entities/Deliver";

@Entity()
export class Driver {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @ManyToOne(type => Store, store => store.drivers)
  store: Store;

  @OneToMany(type => Deliver, deliver => deliver.driver)
  delivers: Deliver[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}