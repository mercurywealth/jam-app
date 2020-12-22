import {Resolver, Query, Mutation, Arg, InputType, Field, Ctx} from 'type-graphql';
import {List, Get, Update, Create, Delete} from '../../helpers/defaultAPIGenerators';
import { User } from '../entities/User';
import {User as DBUser} from '../../db/entities/User';
import {UpdateUserInput} from './User.input';
import Context from '../../types/Context';

@Resolver()
export default class UserResolver {
    @List(DBUser, {paginated: true, search: "title"})
    @Query(()=>[User])
    async users(@Arg("page", { defaultValue: 1 }) page: string, @Arg("search", { defaultValue: "" }) search: string) {}

    @Query(()=>User)
    async me(@Ctx() context: Context){
        return DBUser.findOne(context.user.id)
    }

    @Get(DBUser)
    @Query(()=>User)
    async user(@Arg("id") id: string) {}

    @Get(DBUser, {primaryField: "email"})
    @Query(()=>User)
    async userEmail(@Arg("email") email: string) {}

    @Update(DBUser)
    @Mutation(()=>User)
    async updateUser(@Arg("id") id: string, @Arg("data") data: UpdateUserInput) {}

    @Delete(DBUser)
    @Mutation(()=>Boolean)
    async deleteUser(@Arg("id") id: string) {}
}