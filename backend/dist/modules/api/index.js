"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const api = __importStar(require("../api"));
class API {
    static run(app) {
        for (var file in api) {
            const cl = api[file].default;
            for (var schema in cl[schema]) {
                console.log(cl[schema]);
            }
        }
        //var server = new ApolloServer();
        //server.applyMiddleware({ app });
    }
}
API.typeDefs = apollo_server_express_1.gql `
        type Query {
            hello: String,
            uuid: String
        }
    `;
API.resolvers = {
    Query: {
        hello: () => "Hello World",
        uuid: () => "",
    }
};
exports.default = API;
//# sourceMappingURL=index.js.map