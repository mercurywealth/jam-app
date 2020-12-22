import {ObjectType, Field, ID} from 'type-graphql';
import { User } from './User';

@ObjectType() // GraphQL Object
export class Note {
    @Field(()=>ID) // GraphQL Field
    //@PrimaryGeneratedColumn("uuid") // ORM Column
    id: string;

    @Field(()=>String)
    title: string;

    @Field(()=>String)
    description?: string;

    @Field(()=>User)
    owner: User;
}