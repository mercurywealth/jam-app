import {PropsWithChildren, useState} from 'react';
import {RouteComponentProps } from 'react-router-dom';
import AuthProvider from "../components/providers/auth";
import NoteForm from '../components/forms/noteForm';

interface NoteRouteProps extends RouteComponentProps<{}> {
}

export default function NoteRoute(props: React.PropsWithChildren<NoteRouteProps>) {
    return <AuthProvider>
        <NoteForm/>
    </AuthProvider>
}
