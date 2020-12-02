import React from 'react';
import GraphQLForm from '../components/input/graphQLForm';
import {RouteComponentProps } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import { useGetNoteQuery } from '../graphql/note/__generated__/getnote.generated';
import { useUpdateNoteMutation } from '../graphql/note/__generated__/updatenote.generated';
import { useCreateNoteMutation } from '../graphql/note/__generated__/createnote.generated';

interface NoteRouteState {
    
}
interface NoteRouteProps extends RouteComponentProps<{}> {
    
}

export default class NoteRoute extends React.Component<NoteRouteProps,NoteRouteState>{
    constructor(props: NoteRouteProps){
        super(props);
        this.state={};
    }

    render(){
        return <GraphQLForm title="Note" {...this.props} config={{
            className: "note",
            get: {
                hook: useGetNoteQuery
            },
            update: {
                hook: useUpdateNoteMutation,
            },
            create: {
                hook: useCreateNoteMutation,
            }
        }} fields={[
            {
                name: "title",
                type: "text",
                props: {
                    label: "Title"
                }
            },
            {
                name: "description",
                type: Form.TextArea,
                props: {
                    label: "Content"
                }
            }
        ]} data={{
            owner: "me"
        }}/>;
    }
}