import "reflect-metadata";
import "isomorphic-fetch";
import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + "/../.env"});
import {addAliases} from "module-alias";
addAliases({
    "@app": __dirname,
    "@helpers": __dirname + "/helpers",
    "@gql": __dirname + "/gql",
    "@db": __dirname + "/db",
    "@entities": __dirname + "/db/entities",
});


import express from 'express';
import { createConnection, getConnection, useContainer, getConnectionManager } from "typeorm";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { buildSchema  } from 'type-graphql';
import logger from './helpers/log';
import { isTokenValid } from './helpers/validateJWT';
import { Container } from 'typedi';
import {resolve} from 'path';
import UserService from './db/resolvers/core/UserService';
import microsoftGraph from './helpers/microsoft/microsoftGraph';

const log = logger("main")

async function main() {
    log.info("Starting app...");
    try {

        //Generate schema
        const schema = await buildSchema({
            resolvers: [resolve(__dirname, "gql/resolvers/**/*.{ts,js}")],
            validate: true,
        });

        //Connect typeorm to the database
        useContainer(Container);
        const connection = await createConnection();
        
        //Create Apollo Server + Express server
        const app = express();
        const port = process.env.WEBSITES_PORT ? process.env.WEBSITES_PORT : 4000;
        const server = new ApolloServer({
            schema,
            context: async ({req})=>{
                const authHeader = req.headers.authorization || '';
                const token = authHeader && authHeader.split(' ')[1];
                
                if (token == null || token == "") throw new AuthenticationError("Missing Authentication Token");

                //validate jwt and attach the user to the context
                try {
                    const decoded: any = await isTokenValid(token);
                    const tenant = decoded.extension_Tenant;
                    const connectionManager = getConnectionManager();

                    //Create tenant DB connection if not already created
                    if (!connectionManager.has(tenant) || !connectionManager.get("tenant").isConnected){
                        connectionManager.create({
                            ...getConnection("default").options,
                            name: tenant,
                        });
                    }
                    var context = {user: null, jwt: token, tenant: tenant, connectionName: tenant};
                    
                    const userService = Container.get(UserService);
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
        });
        server.applyMiddleware({app});
        
        //Start listening on the app port
        app.listen(port, () => {
            log.info(`App ready. Listening.`);
        });
    }catch(e: any){
        log.error(e);
    }
}
main();

