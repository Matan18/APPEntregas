import { Entity, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "../../../../stores/infra/typeorm/entities/Store";
import { Deliver } from "../../../../delivers/infra/typeorm/entities/Deliver";

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  store_id: string;

  @ManyToOne(type => Store, store => store.drivers)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(type => Deliver, deliver => deliver.driver)
  delivers: Deliver[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}