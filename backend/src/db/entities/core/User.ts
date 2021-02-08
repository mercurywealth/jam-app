import {Entity, BaseEntity, Column, ManyToOne, JoinColumn, PrimaryColumn} from "typeorm";
import Group from "./Group";

@Entity() // ORM Entity
export default class User extends BaseEntity {
    @PrimaryColumn()
    id: string    

    @Column("simple-array", {nullable: true})
    permissions: string[];

    @ManyToOne(()=>Group)
    @JoinColumn()
    group: Group;
}