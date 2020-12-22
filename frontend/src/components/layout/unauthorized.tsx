import {PropsWithChildren, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import "./unauthorized.css";

interface UnauthorizedProps {
}

export default function Unauthorized(props: React.PropsWithChildren<UnauthorizedProps>) {
    const history = useHistory();
    return <Container className="unauthorized">
        <h1>Access Denied!</h1>
        <p>You do not have the required permissions to access to this page.</p>
        <a onClick={history.goBack}>Go Back</a>
    </Container>;
}