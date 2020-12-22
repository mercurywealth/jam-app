import {PropsWithChildren} from 'react';
import {RouteComponentProps } from 'react-router-dom';
import AuthProvider from "../components/providers/auth";
import NoteForm from '../components/forms/noteForm';

interface NoteRouteProps extends RouteComponentProps<{}> {
}

export default function NoteRoute(_props: PropsWithChildren<NoteRouteProps>) {
    return <AuthProvider role={["createnote", "updatenote"]}>
        <NoteForm/>
    </AuthProvider>
}
