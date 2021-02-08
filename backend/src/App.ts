import { setupMaster } from "cluster";

import express from 'express';
import { ConnectionManager, createConnection, useContainer } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema  } from 'type-graphql';
import logger from './helpers/log';
import { Container } from 'typedi';
import {resolve} from 'path';
import createContext from "./helpers/createContext";
const log = logger("App")

export async function main() {
    log.info("Starting app...");
    try {

        //Generate schema
        log.info("Building GraphQL Schema...");
        const schema = await buildSchema({
            resolvers: [resolve(__dirname, "gql/resolvers/**/*.{ts,js}")],
            validate: true,
        });
        
        //Create Apollo Server + Express server
        log.info("Starting Express + Apollo...");
        const app = express();
        const port = process.env.WEBSITES_PORT ? process.env.WEBSITES_PORT : 4000;
        const server = new ApolloServer({
            schema,
            context: createContext
        });
        server.applyMiddleware({app});

        //Connect typeorm to the database
        log.info("Connecting to default database...");
        
        useContainer(Container);
        const connection = await createConnection();
        
        //Start listening on the app port
        app.listen(port, () => {
            log.info(`App ready. Listening.`);
        });
    }catch(e: any){
        log.error(e);
    }
}