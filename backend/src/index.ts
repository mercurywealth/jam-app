import express from 'express';
import "reflect-metadata";
import {createConnection } from "typeorm";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { buildSchema,  } from 'type-graphql';

async function main() {
    //Connect typeorm to the database
    const connection = await createConnection();
    
    //Generate schema
    const schema = await buildSchema({
        resolvers: [`${__dirname}/resolvers/**/*.{ts,js}`]
    });
    
    //Create Apollo Server + Express server
    const app = express();
    const port = process.env.WEBSITES_PORT ? process.env.WEBSITES_PORT : 4000;
    const server = new ApolloServer({
        schema,
        context: ({req, res})=>{
            const authHeader = req.headers.authorization || '';
            const token = authHeader && authHeader.split(' ')[1]
            if (token == null) return res.sendStatus(401) // if there isn't any token
            //do auth stuff to get the user
            // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err:any, user: any)=>{
            //     if (err){
            //         console.error(err);
            //         return res.sendStatus(403);
            //     }
            //     //req.user = user;
            //     //next();
            // });
            var user = true;
            if (!user) throw new AuthenticationError('you must be logged in'); 
            return {user}
        }
    });
    server.applyMiddleware({app});
    
    //Start listening on the app port
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}
main();

