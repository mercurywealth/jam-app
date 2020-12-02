import {ObjectType, Field, ID, } from 'type-graphql';
import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";
import {PrimaryUUIDColumn} from '../helpers/defaultAPIGenerators';
//Create both a model for the ORM and a entity for GraphQL from the same class! :D

@Entity() // ORM Entity
@ObjectType() // GraphQL Object
export class Note extends BaseEntity {
    @Field(()=>String) // GraphQL Field
    @PrimaryUUIDColumn() 
    //@PrimaryGeneratedColumn("uuid") // ORM Column
    id: Buffer;

    @Field(()=>String)
    @Column()
    title: string;

    @Field(()=>String)
    @Column()
    description?: string;

    @Field(()=>String)
    @Column()
    owner: string;
}