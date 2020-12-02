import {PropsWithChildren} from 'react';
import {useAuth0} from '@auth0/auth0-react';

interface AuthWrapperProps  {

}

export default function AuthWrapper (props: PropsWithChildren<AuthWrapperProps>){
    const {isAuthenticated, loginWithRedirect, isLoading, error} = useAuth0();
    if (!isAuthenticated){
        loginWithRedirect();
    }
    return props.children;
}