import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";
import moment from "moment";
import FormData from "form-data";

type AccessToken = {
    token: string,
    exp: number
}

export class AuthProvider implements AuthenticationProvider {
    tokens: {[key: string]: AccessToken}
    token: string = "";
    exp: number = 0;

    public async getAccessToken(): Promise<string> {
        if (moment().unix() >= this.exp){
            var data = new FormData();
            data.append("client_id", process.env.B2C_CLIENT_ID);
            data.append("client_secret", process.env.B2C_CLIENT_SECRET);
            data.append("scope", `https://graph.microsoft.com/.default`);
            data.append("grant_type", "client_credentials");
            const f = await fetch(`https://login.microsoftonline.com/${process.env.B2C_TENANT}.onmicrosoft.com/oauth2/v2.0/token`, {
                method: "post",
                body: data as any
            });
            const response = await f.json();
            // this.tokens[id] = {
            //     token: response.access_token,
            //     exp: response.expires_in,
            // }
            this.token = response.access_token;
            this.exp = response.expires_in;
        }
        return this.token;
    }
}