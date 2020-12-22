import {InputType, Field} from 'type-graphql';
import GQLUser from '../entities/User';
@InputType()
export class CreateNoteInput {
    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    owner: string;
}

@InputType()
export class UpdateNoteInput {
    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;
}