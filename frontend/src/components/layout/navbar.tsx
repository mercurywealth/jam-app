import {PropsWithChildren, useState} from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useApolloClient } from '@apollo/client';

interface NavBarProps {
    
}

export default function NavBar (props: PropsWithChildren<NavBarProps>){
    const isAuth = useIsAuthenticated();
    const msal = useMsal();
    const client = useApolloClient()

    const logout = ()=>{
        msal.instance.logout();
        client.resetStore();
        localStorage.clear();
    }
    return <Menu>
        <Menu.Item header><Link to="/">Jam-App</Link></Menu.Item>
        {isAuth ? <>
            <Menu.Item content={msal.accounts[0].name}/>
            <Menu.Item content="Logout" icon={<Icon className="far fa-sign-out"/>} style={{marginLeft: "auto"}} onClick={logout}/>
        </> : null}
    </Menu>;
}