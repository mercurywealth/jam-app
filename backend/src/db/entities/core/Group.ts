import {Entity, BaseEntity, Column, ManyToOne, JoinColumn} from "typeorm";
import {PrimaryUUIDColumn} from '@app/helpers/defaultAPIGenerators';

@Entity() // ORM Entity
export default class Group extends BaseEntity {
    @PrimaryUUIDColumn()
    id: string    

    @Column({nullable: true})
    name: string;

    @Column("simple-array", {nullable: true})
    permissions: string[];
}