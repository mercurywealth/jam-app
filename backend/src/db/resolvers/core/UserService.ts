import { Inject, Service } from 'typedi';
import { Repository, EntityRepository, getRepository, getConnection, ConnectionManager } from 'typeorm';
import { InjectConnection, InjectManager, InjectRepository } from 'typeorm-typedi-extensions';
import User from '@entities/core/User';
import GQUser from '@gql/entities/core/User';
import microsoftGraph from '@app/helpers/microsoft/microsoftGraph';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import logger from '@helpers/log'
import Context from '@app/types/Context';
import ConnectionService from './ConnectionService';

const log = logger("UserService");

@Service()
//@EntityRepository(User)
export default class UserService {
    constructor(
        // @InjectRepository(User)
        // private readonly ConnectionService: Repository<User>
        @Inject(()=>ConnectionService)
        private readonly connectionManager: ConnectionService
      ) {}

    async findOne(context: Context, id: string) {
        // const dbuser = await this.repository.findOne(id);
        const dbuser = await this.connectionManager.get(context.connectionName).getRepository(User).findOne(id);
        //console.log(this.connectionManager.get(context.connectionName).getRepository("User"))
        if (dbuser){
            const user = new GQUser();
            //get info from db
            Object.assign(user, dbuser);
            //get info from B2C
            //extension_06f497280edc4b719e58902dbb556e72_Tenant
            //const b2cuserre = await microsoftGraph("/users/"+id).patch({extension_06f497280edc4b719e58902dbb556e72_Tenant: "22bc6eb9-06bf-48c7-95a9-67dfe78f7029"}).catch((r)=>console.log(r));
            const b2cuser = await microsoftGraph("/users/"+id).get();
            // TODO
            return user;
        }
        return null;
    }

    async insert(data: QueryDeepPartialEntity<User>){
        //return await this.repository.insert(data);
    }
}