import React, { PropsWithChildren } from 'react';
import Context, {defaultProvider} from '../../context/auth';

export default function AuthProvider(props: PropsWithChildren<{}>) {
    return <Context.Provider value={defaultProvider}>
        {props.children}
    </Context.Provider>
}