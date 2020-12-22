import {PropsWithChildren, useState} from 'react';
import { useUser } from '../../hooks/user';
import GraphQLForm from '../input/graphQLForm';
import { useGetNoteQuery } from '../../graphql/note/__generated__/getnote.generated';
import { useUpdateNoteMutation } from '../../graphql/note/__generated__/updatenote.generated';
import { useCreateNoteMutation } from '../../graphql/note/__generated__/createnote.generated';
import { Form } from 'semantic-ui-react';

interface NoteFormProps {
}

export default function NoteForm(props: React.PropsWithChildren<NoteFormProps>) {
    const me = useUser();
    
    return <GraphQLForm title="Note" {...props} config={{
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
        owner: {
            value: me.id,
            appendTo: "create"
        }
    }}/>;
}