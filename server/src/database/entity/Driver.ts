import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from "typeorm";
import { Store } from "./Store";
import { Deliver } from "./Deliver";

@Entity()
export class Driver{
    @PrimaryColumn()
    id:string;

    @Column()
    name:string;
    
    @Column()
    password:string;
    
    @ManyToOne(type=>Store, store=>store.drivers)
    store:Store;

    @OneToMany(type=>Deliver, deliver=>deliver.driver)
    delivers:Deliver[]
}