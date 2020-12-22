import {Resolver, Query, Mutation, Arg, InputType, Field, Ctx} from 'type-graphql';
import {List, Get, Update, Create, Delete, Restricted} from '../../helpers/defaultAPIGenerators';
import {Note} from '../entities/Note';
import {Note as DBNote} from '../../db/entities/Note';
import {CreateNoteInput, UpdateNoteInput} from './Note.input';


@Resolver()
export default class NoteResolver {
    @Restricted()
    @List(DBNote, {paginated: true, search: "title"})
    @Query(()=>[Note])
    async notes(@Arg("page", { defaultValue: 1 }) page: string, @Arg("search", { defaultValue: "" }) search: string) {}

    @Get(DBNote)
    @Query(()=>Note)
    async note(@Arg("id") id: string) {}

    @Create(DBNote)
    @Mutation(()=>Note)
    async createNote(@Arg("data") data: CreateNoteInput) {}

    @Update(DBNote)
    @Mutation(()=>Note)
    async updateNote(@Arg("id") id: string, @Arg("data") data: UpdateNoteInput) {}

    @Delete(DBNote)
    @Mutation(()=>Boolean)
    async deleteNote(@Arg("id") id: string) {}
}