import {Resolver, Query, Mutation, Arg, Ctx} from 'type-graphql';
import {List, Get, Update, Delete, Restricted} from '../../helpers/defaultAPIGenerators';
import GQLUser from '../entities/User';
import User from '../../db/entities/User';
import {UpdateUserInput} from './User.input';
import Context from '../../types/Context';
import Roles from '../../types/Roles.json';

@Resolver()
export default class UserResolver {
    @Restricted([Roles.getuser.id])
    @List(User, {paginated: true, search: "title"})
    @Query(()=>[GQLUser])
    async users(@Arg("page", { defaultValue: 1 }) page: string, @Arg("search", { defaultValue: "" }) search: string) {}

    @Restricted()
    @Query(()=>GQLUser)
    async me(@Ctx() context: Context){
        return User.findOne(context.user.id)
    }

    @Restricted([Roles.getuser.id])
    @Get(User)
    @Query(()=>GQLUser)
    async user(@Arg("id") id: string) {}

    @Restricted([Roles.getuser.id])
    @Get(User, {primaryField: "email"})
    @Query(()=>GQLUser)
    async userEmail(@Arg("email") email: string) {}

    @Restricted([Roles.updateuser.id])
    @Update(User)
    @Mutation(()=>GQLUser)
    async updateUser(@Arg("id") id: string, @Arg("data") data: UpdateUserInput) {}

    @Restricted([Roles.deleteuser.id])
    @Delete(User)
    @Mutation(()=>Boolean)
    async deleteUser(@Arg("id") id: string) {}
}