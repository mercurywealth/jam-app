import {InputType, Field} from 'type-graphql';
import { User } from '../entities/User';
@InputType()
export class CreateNoteInput {
    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    ownerId: string;
}

@InputType()
export class UpdateNoteInput {
    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    ownerId?: string;
}