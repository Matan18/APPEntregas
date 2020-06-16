import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import {Deliver} from "./Deliver";
import { Driver } from "./Driver";

@Entity()
export class Store{
    @PrimaryColumn()
    id:string;

    @Column()
    name:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @OneToMany(type=>Driver, driver=>driver.storeId)
    driversId:Driver[];
    
    @OneToMany(type=>Deliver, deliver=>deliver.storeId)
    deliversId:Deliver[];
}