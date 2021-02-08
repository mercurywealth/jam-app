import { AuthenticationError } from "apollo-server-express";
import { getConnectionManager, getConnection, ConnectionManager, createConnection } from "typeorm";
import { isTokenValid } from '@helpers/validateJWT';
import UserService from '@db/resolvers/core/UserService';
import Tenant from "@entities/core/Tenant";
import Context from "@app/types/Context";
import logger from '@helpers/log';
import { Container } from 'typedi';
import path from "path";
import ormConfig from "@app/../ormConfig";
import microsoftGraph from "@helpers/microsoft/microsoftGraph";

const log = logger("createContext");

export default async function createContext({req}){
    const authHeader = req.headers.authorization || '';
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null || token == "") throw new AuthenticationError("Missing Authentication Token");

    //validate jwt and attach the user to the context
    try {
        const decoded: any = await isTokenValid(token);
        if (!decoded.extension_Tenant) throw new AuthenticationError("Missing tenant claim in JWT");
        const tenant = await Tenant.findOne(decoded.extension_Tenant);
        const connectionManager = getConnectionManager();

        //Create tenant DB connection if not already created
        if (!connectionManager.has(tenant.id) || !connectionManager.get(tenant.id).isConnected){
            var [host, port] = tenant.db_server.split(":");
            var connectionOptions = {
                name: tenant.id,
                type: ormConfig.type,
                database: tenant.db_database,
                host: host,
                port: parseInt(port),
                username: ormConfig.username,
                password: ormConfig.password,
                entities: [path.resolve(__dirname, "../db/entities/**/*.{ts,js}")],
                entityPrefix: process.env.DATABASE_PREFIX,
                synchronize: false,
            };
            const conn = await createConnection(connectionOptions);
        }
        var connection = connectionManager.get(tenant.id);
        var context: Context = {user: null, jwt: token, tenant: tenant, connectionName: connection.name};
        
        const userService = Container.get(UserService);
        // await microsoftGraph("/users/"+decoded.oid).patch({extension_06f497280edc4b719e58902dbb556e72_Tenant: "70192105-d8bd-4a15-943b-bd3f47c34965"}).catch((r)=>console.log(r));
        // process.exit();
        //const dbuser = await userService.insert(context, {id: decoded.oid, permissions: ["User.get"]});
        const user = await userService.findOne(context, decoded.oid);
        if (user) context.user = user; //existing user, get from DB
        // New user, create
        else {
            //const dbuser = await userService.insert({id: decoded.oid, permissions: ["User.get"]});
            //context.user = {...dbuser, firstname: decoded.given_name, lastname: decoded.family_name, email: decoded.emails[0]};
        }
        return context;
    }catch(e){
        throw new AuthenticationError(e.message);
    }
}