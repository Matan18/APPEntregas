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

    @ManyToOne(type => Store, store=>store.deliversId, {cascade:true})
    storeId:Store;

    @OneToMany(type=> Package, pack=>pack.deliverId)
    packagesId:Package[]

    @ManyToOne(type=>Driver, driver=>driver.deliversId)
    driverId:Driver;

}