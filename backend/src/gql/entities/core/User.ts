import {ObjectType, Field, ID} from 'type-graphql';

@ObjectType("User") // GraphQL Object
export default class GQLUser {
    @Field(()=>ID) // GraphQL Field
    id: string;

    @Field()
    email: string;

    @Field()
    firstName?: string;

    @Field()
    lastName?: string;

    @Field(()=>[String])
    permissions?: string[];
}