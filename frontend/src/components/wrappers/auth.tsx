import {PropsWithChildren, ReactElement} from 'react';
import Error from '../layout/error';
import { useMsalAuthentication, useIsAuthenticated } from "@azure/msal-react";
import { InteractionType } from '@azure/msal-browser';
import { Loader } from 'semantic-ui-react';


interface AuthWrapperProps  {

}

const tenant = process.env.REACT_APP_B2C_TENANT!;
const subdomain = tenant.split(".")[0];
const flow = process.env.REACT_APP_B2C_RESETFLOW;
export default function AuthWrapper (props: PropsWithChildren<AuthWrapperProps>){
    const { result, error} = useMsalAuthentication(InteractionType.Popup);
    const isAuth = useIsAuthenticated();

    if (error) {
        if (error.errorMessage.indexOf("AADB2C90118") == 0){
            //Password reset
            document.location.href = `https://${subdomain}.b2clogin.com/tfp/${tenant}/${flow}`;
        }
        return <Error code={error.errorCode + "(" + error.name + ")"} message={error.errorMessage}/>;
    }
    if (result){
        console.log(result);
    }
    if (!isAuth) {
        //login();
        return <Loader active/>
    }
    return props.children as ReactElement<any>;
}