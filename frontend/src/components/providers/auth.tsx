import {PropsWithChildren, ReactElement, useEffect, useState} from 'react';
import Error from '../layout/error';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Loader } from 'semantic-ui-react';
import authConfig from '../../config/authConfig';
import { setContext } from '@apollo/client/link/context';
import {userContext} from '../../hooks/user';
import { useMeLazyQuery } from '../../graphql/user/__generated__/me.generated';
import {User} from '../../__generated__/types';

interface AuthWrapperProps  {

}

const splitError = function(error: string){
    var out: {[key: string]: string} = {};
    error.split("\n").map((v,i)=>{
        var [key, value] = v.split(": ");
        out[key] = value;
    });
    return out;
}

export default function AuthProvider (props: PropsWithChildren<AuthWrapperProps>){
    const {instance, accounts, inProgress } = useMsal();
    const isAuth = useIsAuthenticated();
    const req = {scopes: ["openid", "profile"]};
    const [loading, setLoading] = useState(true);
    var [error, setError] = useState({error: false, errorCode: null, name: null, errorMessage: "", message: ""});
    const [getMe, me] = useMeLazyQuery()

    useEffect(()=>{
        instance.handleRedirectPromise().then((r)=>{
            if (!r && !error.error){
                if (accounts.length === 0){
                    instance.loginRedirect(req);
                }else{
                    instance.ssoSilent({loginHint: accounts[0].username, ...req}).then(value=>{
                        console.log("yep");
                        localStorage.setItem("api_token", value.idToken);
                        localStorage.setItem("api_token_exp", (value.idTokenClaims as any).exp)
                        
                        try {
                            getMe()
                        }catch(e){}
                    }).catch(error=>setError(error));
                    //instance.acquireTokenSilent({account: accounts[0], ...req})
                }
            }else if (r != null){
                localStorage.setItem("api_token", r.idToken)
                localStorage.setItem("api_token_exp", (r.idTokenClaims as any).exp)
                try {
                    getMe()
                }catch(e){}
            }
        }).catch(e=>{
            console.log(e);
            if (!e.errorMessage) e.errorMessage = "";
            if (e.errorMessage.indexOf("AADB2C90118") > -1){
                var split = splitError(e.errorMessage);
                // Password Reset Request
                if (split.login_hint){
                    instance.loginRedirect({authority: authConfig.authorities.reset, loginHint: split.login_hint, ...req})
                }else{
                    instance.loginRedirect({authority: authConfig.authorities.reset, ...req})
                }
            }else if (e.errorMessage.indexOf("AADB2C90091") > -1) {
                // Cancelled Password Reset
                instance.loginRedirect(req);
            }else{
                console.log(e);
                error = {...e, error: true};
                setError(error);
            }
        });
    }, [instance]);

    if (me.data && !me.loading && loading){
        setLoading(false)
        console.log(me.data);
    }
    if (error.error) return <Error code={error.errorCode + " (" + error.name + ")"} message={error.errorMessage}/>;
    if (loading) return <Loader active/>;

    return <userContext.Provider value={me.data as any}>
        {props.children as ReactElement<any>}
    </userContext.Provider>;
}