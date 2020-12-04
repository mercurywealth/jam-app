import { GraphQLError } from 'graphql';
import React from 'react';

interface ErrorState {
    
}
interface ErrorProps {
    message: string,
    graphQLErrors?: readonly GraphQLError[],
    code?: string,
}

export default class Error extends React.Component<ErrorProps,ErrorState>{
    constructor(props: ErrorProps){
        super(props);
        this.state={};
    }

    render(){
        return <div className="mwm-error">
            <h1>Uh-oh! An error occured</h1>
            <code>
                {this.props.code ? this.props.code + ": " : null}{this.props.message}
                {this.props.graphQLErrors ? [
                    "\n\n-----GraphQL Errors-----",
                    this.props.graphQLErrors.map((v: GraphQLError)=>{
                        return `\n[${v.extensions ? v.extensions.code : "UNKNOWN_ERROR_CODE"}] ${v.message}`;
                    })
                ] : null}
            </code>
        </div>;
    }
}