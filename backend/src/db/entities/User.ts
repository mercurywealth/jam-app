import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, PrimaryColumn, Index} from "typeorm";
import {PrimaryUUIDColumn} from '../../helpers/defaultAPIGenerators';
//Create both a model for the ORM and a entity for GraphQL from the same class! :D

@Entity() // ORM Entity
export class User extends BaseEntity {
    @PrimaryUUIDColumn()
    id: string    

    @Column({unique: true})
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;
}