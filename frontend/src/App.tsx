import React from 'react';
import {Menu, Icon} from 'semantic-ui-react';
import {BrowserRouter as Router,Switch,Route,Link} from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { MsalProvider } from "@azure/msal-react";
import { Configuration,  PublicClientApplication } from "@azure/msal-browser";
import Navbar from './components/layout/navbar';

//Routes
import MainRoute from './routes/main';
import NoteRoute from './routes/note';

//Setup Apollo client
const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI,
    cache: new InMemoryCache()
});

// MSAL configuration
const tenant = process.env.REACT_APP_B2C_TENANT!;
const subdomain = tenant.split(".")[0];
const flow = process.env.REACT_APP_B2C_SIGNINFLOW!;
const msalConfiguration: Configuration = {
    auth: {
        authority: `https://${subdomain}.b2clogin.com/tfp/${tenant}/${flow}`,
        knownAuthorities: [`https://${subdomain}.b2clogin.com/tfp/${tenant}/${flow}`],
        clientId: process.env.REACT_APP_B2C_CLIENT!,
        //redirectUri: window.location.origin,
        //navigateToLoginRequestUrl: true,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};
console.log(msalConfiguration.auth!.authority);
const msalPCA = new PublicClientApplication(msalConfiguration);

export default function App (){
    return <MsalProvider instance={msalPCA}>
        <Router>
            <Navbar/>
            <ApolloProvider client={client}>
                <Switch>
                    <Route path="/new" component={NoteRoute}/>
                    <Route path="/note/:id" component={NoteRoute}/>
                    
                    <Route path="/" component={MainRoute}/>
                </Switch>
            </ApolloProvider>
        </Router>
    </MsalProvider>;
}