import React from 'react';
import { MsalAuthProvider, LoginType } from "react-aad-msal";

const tenant = process.env.REACT_APP_B2C_TENANT;
const signIn = process.env.REACT_APP_B2C_SIGNINFLOW;
const clientID = process.env.REACT_APP_B2C_CLIENT;

const subdomain = tenant?.split(".")[0];
const instance = `https://${subdomain}.b2clogin.com/tfp/`;
const signInAuthority = `${instance}${tenant}/${signIn}`;

const signInConfig = {
    auth: {
        authority: signInAuthority!,
        clientId: clientID!,
        redirectUri: process.env.DEV ? "https://localhost:3000" : window.location.origin,
        validateAuthority: false,
    },
    cache: {
        cacheLocation: "sessionStorage" as "sessionStorage",
        storeAuthStateInCookie: true,
    },
};

const authenticationParameters = {
    scopes: [
        "https://graph.microsoft.com/User.Read",
    ]
}

const options = {
    loginType: LoginType.Redirect,
    tokenRefreshUri: window.location.origin + "/auth",
}

export const defaultProvider = new MsalAuthProvider(signInConfig, authenticationParameters, options);
export default React.createContext<MsalAuthProvider>(defaultProvider);