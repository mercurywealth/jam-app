import {Resolver, Query, Mutation, Arg, InputType, Field, Ctx} from 'type-graphql';
import {List, Get, Update, Create, Delete, Restricted} from '../../helpers/defaultAPIGenerators';
import GQLNote from '../entities/Note';
import Note from '../../db/entities/Note';
import {CreateNoteInput, UpdateNoteInput} from './Note.input';


@Resolver()
export default class NoteResolver {
    @Restricted()
    @List(Note, {paginated: true, search: "title", where: {owner: "@me.id"}})
    @Query(()=>[GQLNote])
    async notes(@Arg("page", { defaultValue: 1 }) page: string, @Arg("search", { defaultValue: "" }) search: string) {}

    @Restricted()
    @Get(Note, {where: {owner: "@me.id"}})
    @Query(()=>GQLNote)
    async note(@Arg("id") id: string) {}

    @Restricted()
    @Create(Note)
    @Mutation(()=>GQLNote)
    async createNote(@Arg("data") data: CreateNoteInput) {}

    @Restricted()
    @Update(Note)
    @Mutation(()=>GQLNote)
    async updateNote(@Arg("id") id: string, @Arg("data") data: UpdateNoteInput) {}

    @Restricted()
    @Delete(Note)
    @Mutation(()=>Boolean)
    async deleteNote(@Arg("id") id: string) {}
}