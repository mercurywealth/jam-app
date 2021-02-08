import {Entity, BaseEntity, Column, ManyToOne, JoinColumn, getConnection, PrimaryColumn} from "typeorm";
import {PrimaryUUIDColumn} from '@app/helpers/defaultAPIGenerators';
import ormConfig from "@app/../ormconfig";

@Entity({database: ormConfig.database}) // ORM Entity
export default class Tenant extends BaseEntity {
    @PrimaryUUIDColumn()
    id: string;  

    @Column({nullable: true})
    name: string;

    @Column()
    db_database: string;

    @Column()
    db_server: string;

    @Column()
    db_password: string;
}