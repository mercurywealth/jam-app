import {Resolver, Query, Mutation, Arg, InputType, Field} from 'type-graphql';
import {List, Get, Update, Create, Delete} from '../helpers/defaultAPIGenerators';
import {Note} from '../entities/Note';
import e from 'express';

@InputType()
class CreateNoteInput {
    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    owner: string;
}

@InputType()
class UpdateNoteInput {
    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    owner?: string;
}

@Resolver()
export default class NoteResolver {
    @List(Note, {paginated: true, search: "title"})
    @Query(()=>[Note])
    async notes(@Arg("page", { defaultValue: 1 }) page: string, @Arg("search", { defaultValue: "" }) search: string) {}

    @Get(Note)
    @Query(()=>Note)
    async note(@Arg("id") id: string) {}

    @Create(Note)
    @Mutation(()=>Note)
    async createNote(@Arg("data") data: CreateNoteInput) {}

    @Update(Note)
    @Mutation(()=>Note)
    async updateNote(@Arg("id") id: string, @Arg("data") data: UpdateNoteInput) {}

    @Delete(Note)
    @Mutation(()=>Boolean)
    async deleteNote(@Arg("id") id: string) {
        
    }
}