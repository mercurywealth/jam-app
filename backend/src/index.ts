import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + "/../.env"});

import express from 'express';
import "reflect-metadata";
import {createConnection } from "typeorm";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { buildSchema  } from 'type-graphql';
import logger from './helpers/log';
import { isTokenValid } from './helpers/validateJWT';
import User from './db/entities/User';
const log = logger("main")

async function main() {
    log.info("Starting app...");
    try {

        //Connect typeorm to the database
        const connection = await createConnection();
        
        //Generate schema
        const schema = await buildSchema({
            resolvers: [`${__dirname}/gql/resolvers/**/*.{ts,js}`],
            validate: false,
        });
        
        //Create Apollo Server + Express server
        const app = express();
        const port = process.env.WEBSITES_PORT ? process.env.WEBSITES_PORT : 4000;
        const server = new ApolloServer({
            schema,
            context: async ({req})=>{
                const authHeader = req.headers.authorization || '';
                const token = authHeader && authHeader.split(' ')[1];
                var context = {user: null};
                if (token == null) return context;

                //validate jwt and attach the user to the context
                try {
                    const decoded: any = await isTokenValid(token);
                    if (decoded){
                        const user = await User.findOne({id: decoded.oid});
                        if (user) context.user = user;
                        else context.user = await User.insert({id: decoded.oid, email: decoded.emails[0], firstName: decoded.given_name, lastName: decoded.family_name, roles: ["createnote", "editnote", "getnote"]})
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

