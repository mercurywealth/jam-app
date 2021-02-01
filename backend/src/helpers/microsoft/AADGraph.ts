import { AuthProvider } from "@app/helpers/microsoft/AuthProvider";
import { Client, ClientOptions, GraphRequest } from "@microsoft/microsoft-graph-client";

let clientOptions: ClientOptions = {
    authProvider: new AuthProvider(),
    baseUrl: `https://graph.windows.net`,
    defaultVersion: `${process.env.B2C_TENANT}.onmicrosoft.com`,
};

const client = Client.initWithMiddleware(clientOptions);
const get = (path: string): GraphRequest => {
    if (path.includes("?")){
        path += "&api-version=1.6";
    }else{
        path += "?api-version=1.6";
    }
    return client.api(path);
}
export default get;