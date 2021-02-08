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

    public calculatePermissions(): string[]{
        var perms = this.permissions;
        for(var id in Permissions){
            if (Permissions[id].default && !perms.includes(id)) perms.push(id);
        }
        return perms;
    }

    public hasPermission(role: string){
        return this.calculatePermissions().includes(role);
    }

    public hasPermissions(perms: string[], requireAll: boolean = true){
        var count = 0;
        for(var role of this.calculatePermissions()){
            for(var testrole of perms){
                if (role == testrole) {
                    if (requireAll) count++;
                    else return true;
                }
            }
        }
        return requireAll && count == perms.length;
    }
}