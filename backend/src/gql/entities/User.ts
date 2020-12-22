import {ObjectType, Field, ID} from 'type-graphql';

@ObjectType() // GraphQL Object
export class User {
    @Field(()=>ID) // GraphQL Field
    id: string;

    @Field(()=>String)
    email: string;

    @Field(()=>String)
    firstName?: string;

    @Field(()=>String)
    lastName?: string;
}