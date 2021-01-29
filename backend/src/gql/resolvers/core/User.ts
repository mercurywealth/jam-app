import {Resolver, Query, Mutation, Arg, Ctx} from 'type-graphql';
import {List, Get, Update, Delete, Restricted} from '@app/helpers/defaultAPIGenerators';
import GQLUser from '@app/gql/entities/core/User';
import User from '@entities/core/User';
import {UpdateUserInput} from './User.input';
import Context from '@app/types/Context';
import { Container } from "typedi";
import UserService from '@app/db/resolvers/UserService';

@Resolver()
export default class UserResolver {
    //@Restricted([Permissions.getuser.id])
    @Query(()=>[GQLUser])
    async users(@Arg("page", { defaultValue: 1 }) page: string, @Arg("search", { defaultValue: "" }) search: string) {
        const userService = Container.get(UserService);

    }

    //@Restricted(User, ["get"])
    @Query(()=>GQLUser)
    async me(@Ctx() context: Context){
        const userService = Container.get(UserService);
        return userService.findOne(context.user.id);
    }

    //@Restricted([Permissions.getuser.id])
    @Get(User)
    @Query(()=>GQLUser)
    async user(@Arg("id") id: string) {}

    //@Restricted(User, ["get"])
    @Get(User, {primaryField: "email"})
    @Query(()=>GQLUser)
    async userEmail(@Arg("email") email: string) {}

    //@Restricted([Permissions.updateuser.id])
    @Update(User)
    @Mutation(()=>GQLUser)
    async updateUser(@Arg("id") id: string, @Arg("data") data: UpdateUserInput) {}

    //@Restricted([Permissions.deleteuser.id])
    @Delete(User)
    @Mutation(()=>Boolean)
    async deleteUser(@Arg("id") id: string) {}
}