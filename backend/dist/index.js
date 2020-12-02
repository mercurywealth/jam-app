"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const Note_1 = require("./resolvers/Note");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield typeorm_1.createConnection();
        //Generate schema
        const schema = yield type_graphql_1.buildSchema({
            resolvers: [Note_1.NoteResolver]
        });
        //Create Apollo Server + Express server
        const app = express_1.default();
        const port = process.env.WEBSITES_PORT ? process.env.WEBSITES_PORT : 4000;
        const server = new apollo_server_express_1.ApolloServer({ schema });
        server.applyMiddleware({ app });
        //Start listening on the app port
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    });
}
main();
//# sourceMappingURL=index.js.map