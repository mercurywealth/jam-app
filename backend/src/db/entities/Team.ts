import { relativeTimeThreshold } from "moment";
import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, PrimaryColumn, Index} from "typeorm";
import {PrimaryUUIDColumn} from '../../helpers/defaultAPIGenerators';
import Roles from '../../types/Roles.json';

@Entity() // ORM Entity
export default class Team extends BaseEntity {
    @PrimaryUUIDColumn()
    id: string    

    @Column({nullable: true})
    name: string;

    @Column("simple-array", {nullable: true})
    roles: string[];

    public calculateRoles(): string[]{
        var roles = this.roles;
        for(var id in Roles){
            if (Roles[id].default && !roles.includes(id)) roles.push(id);
        }
        return roles;
    }

    public hasRole(role: string){
        return this.calculateRoles().includes(role);
    }

    public hasRoles(roles: string[], and: boolean = true){
        var count = 0;
        for(var role of this.calculateRoles()){
            for(var testrole of roles){
                if (role == testrole) {
                    if (and) count++;
                    else return true;
                }
            }
        }
        return and && count == roles.length;
    }
}