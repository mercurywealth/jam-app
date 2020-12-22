import {Entity, BaseEntity, Column, JoinColumn, OneToOne, Index} from "typeorm";
import {PrimaryUUIDColumn} from '../../helpers/defaultAPIGenerators';
import { User } from "./User";
//Create both a model for the ORM and a entity for GraphQL from the same class! :D

@Entity() // ORM Entity
export class Note extends BaseEntity {
    @PrimaryUUIDColumn() 
    //@PrimaryGeneratedColumn("uuid") // ORM Column
    id: Buffer;

    @Column()
    title: string;

    @Column()
    description?: string;

    @OneToOne(()=>User)
    @JoinColumn()
    owner: User;
}

