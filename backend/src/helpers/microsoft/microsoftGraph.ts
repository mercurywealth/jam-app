import { AuthProvider } from "@app/helpers/microsoft/AuthProvider";
import { Client, ClientOptions, GraphRequest } from "@microsoft/microsoft-graph-client";
let clientOptions: ClientOptions = {
    authProvider: new AuthProvider(),
    defaultVersion: "beta",
};

const client = Client.initWithMiddleware(clientOptions);
const get = (path: string): GraphRequest => {
    return client.api(path);
}
export default get;