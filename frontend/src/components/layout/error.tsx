import { ApolloError, ServerError } from '@apollo/client';
import { GraphQLError } from 'graphql';
import React from 'react';
import { NodeBuilderFlags } from 'typescript';

interface ErrorState {
    
}
interface ErrorProps {
    message?: string,
    graphQL?: ApolloError,
    code?: string,
}

export default class Error extends React.Component<ErrorProps,ErrorState>{
    constructor(props: ErrorProps){
        super(props);
        this.state={};
    }

    render(){
        const netErr: ServerError | null = this.props.graphQL?.networkError ? this.props.graphQL.networkError! as ServerError : null;
        return <div className="mwm-error">
            <h1>Uh-oh! An error occured</h1>
            <code>
                {this.props.code ? this.props.code + ": " : null}{this.props.graphQL ? this.props.graphQL!.message : this.props.message}
                {this.props.graphQL ? <>
                    {"\n\n"}-----Error Details-----
                    {this.props.graphQL.graphQLErrors.map((v: GraphQLError)=>{
                        return `\n[${v.extensions ? v.extensions.code : "UNKNOWN_ERROR_CODE"}] ${v.message}`;
                    })}
                    {netErr ? "\n"+netErr.result.errors.map((v: Record<string, any>)=>{
                        return `\n${v.message}`
                    }) : null}
                </> : null}
            </code>
        </div>;
    }
}