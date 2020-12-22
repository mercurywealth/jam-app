import {Entity, BaseEntity, Column, JoinColumn, OneToOne, ManyToOne, Index} from "typeorm";
import {PrimaryUUIDColumn} from '../../helpers/defaultAPIGenerators';
import User from "./User";
//Create both a model for the ORM and a entity for GraphQL from the same class! :D

@Entity() // ORM Entity
export default class Note extends BaseEntity {
    @PrimaryUUIDColumn() 
    id: Buffer;

    @Column()
    title: string;

    @Column()
    description?: string;

    @ManyToOne(()=>User)
    @JoinColumn()
    owner: User;
}

