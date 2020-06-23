import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { Store } from "./Store";
import { Driver } from "./Driver";
import { Package } from "./Package";

@Entity()
export class Deliver{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    key:string;

    @Column()
    amount:number;

    @ManyToOne(type => Store, store=>store.delivers, {cascade:true})
    store:Store;

    @OneToMany(type=> Package, pack=>pack.deliver)
    packages:Package[]

    @ManyToOne(type=>Driver, driver=>driver.delivers)
    driver:Driver;

}