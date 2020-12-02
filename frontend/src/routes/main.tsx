import React from 'react';
import "./main.css";
import Notes from '../components/views/notes';
import { useHistory, Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

interface MainRouteProps {
    
}

export default function MainRoute (props: MainRouteProps){
    const history = useHistory();
    
    return <Container className="main">
        <Notes/>
    </Container>
}