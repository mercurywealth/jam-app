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