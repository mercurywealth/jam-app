import {ObjectType, Field, ID} from 'type-graphql';
import GQLUser from './User';

@ObjectType("Note") // GraphQL Object
export default class GQLNote {
    @Field(()=>ID) // GraphQL Field
    //@PrimaryGeneratedColumn("uuid") // ORM Column
    id: string;

    @Field(()=>String)
    title: string;

    @Field(()=>String)
    description?: string;

    @Field(()=>GQLUser)
    owner: GQLUser;
}