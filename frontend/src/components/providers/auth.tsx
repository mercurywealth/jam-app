import {PropsWithChildren, ReactElement, useEffect, useState} from 'react';
import Error from '../layout/error';
import { useMsal } from "@azure/msal-react";
import { Loader } from 'semantic-ui-react';
import authConfig from '../../config/authConfig';
import {userContext} from '../../hooks/user';
import { useMeLazyQuery } from '../../graphql/user/__generated__/me.generated';
import Unauthorized from '../layout/unauthorized';
import { AuthenticationResult, InteractionRequiredAuthError } from '@azure/msal-browser';

interface AuthWrapperProps  {
    role?: string | string[],
}

const splitError = function(error: string){
    var out: {[key: string]: string} = {};
    error.split("\n").forEach((v)=>{
        var [key, value] = v.split(": ");
        out[key] = value;
    });
    return out;
}

export default function AuthProvider (props: PropsWithChildren<AuthWrapperProps>){
    const {instance, accounts } = useMsal();
    const [loading, setLoading] = useState(true);
    var [error, setError] = useState({error: false, errorCode: null, name: null, errorMessage: "", message: ""});
    const [getMe, me] = useMeLazyQuery()
    const baseRequest = {
        scopes: ["openid", "profile", "offline_access"],
    };

    const accquireToken = (cb: (token: string)=>void)=>{
        if (accounts.length === 0){
            instance.loginRedirect(baseRequest);
        }else{
            instance.ssoSilent({...baseRequest, account: accounts[0]}).then((tokenResponse)=>{
                console.log("did it");
                console.log(tokenResponse);
                cb(tokenResponse.idToken);
            }).catch(responseError);
        }
    }

    const responseError = (e: any)=>{
        if (!e.errorMessage) e.errorMessage = "";
        if (e.errorMessage.indexOf("AADB2C90118") > -1){
            var split = splitError(e.errorMessage);
            // Password Reset Request
            if (split.login_hint){
                instance.loginRedirect({authority: authConfig.authorities.reset, loginHint: split.login_hint, ...baseRequest})
            }else{
                instance.loginRedirect({authority: authConfig.authorities.reset, ...baseRequest})
            }
        }else if (e.errorMessage.indexOf("AADB2C90091") > -1) {
            // Cancelled Password Reset
            instance.loginRedirect(baseRequest);
        }else{
            setError({...e, error: true});
        }
    }


    useEffect(()=>{
        instance.handleRedirectPromise().then((response)=>{
            accquireToken((token)=>{
                console.log(token);
            });
        }).catch(responseError);
        
    //     instance.handleRedirectPromise().then((r)=>{
    //         if (!r && !error.error){
    //             if (accounts.length === 0){
    //                 instance.acquireTokenRedirect(req);
    //             }else{
    //                 var currentTime = new Date().getTime() / 1000;
    //                 console.log(localStorage.getItem("api_token_exp"), "vs", currentTime);
    //                 if (localStorage.getItem("api_token_exp") == null || currentTime >= parseInt(localStorage.getItem("api_token_exp")!)) {
    //                     instance.ssoSilent({loginHint: accounts[0].username, ...req}).then(value=>{
    //                         localStorage.setItem("api_token", value.idToken);
    //                         localStorage.setItem("api_token_exp", (value.idTokenClaims as any).exp)
    //                         try {
    //                             getMe()
    //                         }catch(e){}
    //                     }).catch(error=>setError(error));
    //                 }else{
    //                     try {
    //                         getMe()
    //                     }catch(e){}
    //                 }
    //             }
    //         }else if (r !== null){
    //             console.log("yep", r);
    //             localStorage.setItem("api_token", r.idToken)
    //             localStorage.setItem("api_token_exp", (r.idTokenClaims as any).exp)
    //             try {
    //                 getMe()
    //             }catch(e){}
    //         }
    //     }).catch(e=>{
    //         if (!e.errorMessage) e.errorMessage = "";
    //         if (e.errorMessage.indexOf("AADB2C90118") > -1){
    //             var split = splitError(e.errorMessage);
    //             // Password Reset Request
    //             if (split.login_hint){
    //                 instance.loginRedirect({authority: authConfig.authorities.reset, loginHint: split.login_hint, ...req})
    //             }else{
    //                 instance.loginRedirect({authority: authConfig.authorities.reset, ...req})
    //             }
    //         }else if (e.errorMessage.indexOf("AADB2C90091") > -1) {
    //             // Cancelled Password Reset
    //             instance.loginRedirect(req);
    //         }else{
    //             setError({...e, error: true});
    //         }
    //     });
    }, []);



    const hasRole = (roles: string[]): boolean => {
        for(var role of roles){
            if (me.data!.me.roles.includes(role)) return true;
        }
        return false;
    }


    if (me.data && !me.loading && loading) setLoading(false);
    if (error.error) return <Error code={error.errorCode + " (" + error.name + ")"} message={error.errorMessage}/>;
    if (loading) return <Loader active/>;
    if (props.role){
        const requiredRoles = typeof props.role == "string" ? [props.role] : props.role;
        if (!hasRole(requiredRoles)) return <Unauthorized/>;
    }

    return <userContext.Provider value={me.data!.me as any}>
        {props.children as ReactElement<any>}
    </userContext.Provider>;
}