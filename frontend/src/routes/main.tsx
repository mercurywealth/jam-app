import "./main.css";
import Notes from '../components/views/notes';
import { useHistory, Link } from 'react-router-dom';
import { Container, Loader } from 'semantic-ui-react';
import AuthWrapper from "../components/wrappers/auth";

interface MainRouteProps {}

export default function MainRoute (props: MainRouteProps){
    const history = useHistory();
    return <Container className="main">
        <AuthWrapper>
            <Notes/>
        </AuthWrapper>
    </Container>
}