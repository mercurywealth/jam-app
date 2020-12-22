import React from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { MsalProvider } from "@azure/msal-react";
import { Configuration,  PublicClientApplication } from "@azure/msal-browser";
import Navbar from './components/layout/navbar';
import authConfig from './config/authConfig';
import { onError } from "@apollo/client/link/error";

//Routes
import MainRoute from './routes/main';
import NoteRoute from './routes/note';



//Setup Apollo client
const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URI + "/graphql"
});
const authLink = setContext((_, {headers})=>{
    const token = localStorage.getItem("api_token");
    const exp = localStorage.getItem("api_token_exp");
    if (token && exp) {
        if (parseInt(exp) > new Date(exp).getTime()) console.log("expired")
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : ""
            }
        }
    }

});
const errorLink = onError(({graphQLErrors, networkError, operation})=>{
    if (graphQLErrors){
        graphQLErrors.forEach(({message})=>{
            console.error(`[GraphQL Error]: Operation: ${operation.operationName}, Message: \n${message}`);
        })
    }
    if (networkError){
        console.error(`[Network Error]: Operation: ${operation.operationName}, Message: \n${networkError}`);
    }
})
const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI,
    cache: new InMemoryCache({
        addTypename: false
    }),
    link: ApolloLink.from([errorLink, authLink, httpLink]),

});

// MSAL configuration

const msalConfiguration: Configuration = {
    auth: {
        authority: authConfig.authorities.login,
        knownAuthorities: Object.values(authConfig.authorities),
        clientId: process.env.REACT_APP_B2C_CLIENT!,
        redirectUri: window.location.origin,
        navigateToLoginRequestUrl: true,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};
const msalPCA = new PublicClientApplication(msalConfiguration);

export default function App (){
    return <MsalProvider instance={msalPCA}>
        <ApolloProvider client={client}>
            <Router>
                <Navbar/>
                
                    <Switch>
                        <Route path="/new" component={NoteRoute}/>
                        <Route path="/note/:id" component={NoteRoute}/>
                        
                        <Route path="/" component={MainRoute}/>
                    </Switch>
                
            </Router>
        </ApolloProvider>
    </MsalProvider>;
}