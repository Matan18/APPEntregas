import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from "typeorm";
import { Deliver } from "./Deliver";

@Entity()
export class Package{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    product:string;

    @Column()
    latitude:number;

    @Column()
    longitude:number;

    @ManyToOne(type=> Deliver, deliver=>deliver.packagesId, {cascade:true})
    deliverId:Deliver

}