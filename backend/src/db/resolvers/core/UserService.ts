import { Inject, Service } from 'typedi';
import { Repository, ConnectionManager, DeepPartial, Connection, getConnection } from 'typeorm';
import { InjectConnection, InjectRepository } from 'typeorm-typedi-extensions';
import User from '@entities/core/User';
import GQLUser from '@gql/entities/core/User';
import microsoftGraph from '@app/helpers/microsoft/microsoftGraph';
import logger from '@helpers/log'
import Context from '@app/types/Context';
import { InjectConnectionManager } from '@app/decorators/InjectConnectionManager';

const log = logger("UserService");

@Service()
//@EntityRepository(User)
export default class UserService {
    constructor(
        // @InjectRepository(User)
        // private readonly repository: Repository<User>,
        @InjectConnection()
        private readonly defaultConnection: Connection,
        @InjectConnectionManager()
        private readonly connectionManager: ConnectionManager,
      ) {}

    async findOne(context: Context, id: string): Promise<GQLUser> {
        const connection = this.connectionManager.get(context.connectionName);
        const dbuser = await connection.getRepository("User").findOne(id);

        if (dbuser){
            var user = new GQLUser();
            //get info from db
            Object.assign(user, dbuser);
            //get info from B2C
            //extension_06f497280edc4b719e58902dbb556e72_Tenant
            const b2cuser = await microsoftGraph("/users/"+id+"?$select=givenName,surname,identities").get();
            user.firstName = b2cuser.givenName;
            user.lastName = b2cuser.surname;
            for(var identity of b2cuser.identities){
                if (identity.signInType == "emailAddress"){
                    user.email = identity.issuerAssignedId;
                    break;
                }
            }

            console.log(user);
            return user;
        }
        return null;
    }

    async insert(context: Context, data: DeepPartial<User>){
        const connection = this.connectionManager.get(context.connectionName);
        return await connection.getRepository("User").save(data);
    }
}