import React from 'react';
import {Menu, Icon} from 'semantic-ui-react';
import {BrowserRouter as Router,Switch,Route,Link} from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
//import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { AzureAD, withAuthentication } from "react-aad-msal";
import AuthProvider from './components/wrappers/authProvider';

//Routes
import MainRoute from './routes/main';
import NoteRoute from './routes/note';

//Setup Apollo client
const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI,
    cache: new InMemoryCache()
});

export default function App (){
    return <Router>
        <Menu>
            <Menu.Item header><Link to="/">Jam-App</Link></Menu.Item>
            <Menu.Item content="Logout" icon={<Icon className="far fa-sign-out"/>} style={{marginLeft: "auto"}}/>
        </Menu>
        <ApolloProvider client={client}>
            <Switch>
                <Route path="/new" component={withAuthentication(NoteRoute, {provider: AuthProvider})}/>
                <Route path="/note/:id" component={withAuthentication(NoteRoute, {provider: AuthProvider})}/>
                
                <Route path="/" component={MainRoute}/>
            </Switch>
        </ApolloProvider>
    </Router>;
}