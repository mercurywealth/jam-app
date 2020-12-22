import React, {useState, useEffect} from 'react';
import { Loader, Card, Button, Icon } from 'semantic-ui-react';
import Error from '../layout/error';
import { useGetNotesQuery } from '../../graphql/note/__generated__/getnotes.generated';
import { useHistory, Link } from 'react-router-dom';
import DeleteModal from '../modals/delete';
import { useDeleteNoteMutation } from '../../graphql/note/__generated__/deletenote.generated';

import "./notes.css";
import { useUser } from '../../hooks/user';

interface NotesProps {
}

export default function Notes (props: NotesProps){
    //Setup Hooks
    //var [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [id, setID] = useState(null);
    const history = useHistory();
    const me = useUser();
    const { loading, error, data, refetch, startPolling, stopPolling} = useGetNotesQuery();
    useEffect(()=>{
        refetch();
        stopPolling()
        startPolling(1000);
    }, []);
    //Loading and error
    if (loading) return <Loader active/>
    if (error) return <Error graphQL={error}/>

    //Funcs
    const create = ()=>{
        history.push("/new");
    }

    const edit = (id: any)=>{
        history.push(`/note/${id}`);
    }

    const del = (id: any)=>{
        setID(id);
        setModal(true);
    }

    const hideModal = (success: boolean)=>{
        setModal(false);
        refetch();
        return {};
    }


    if (!data){
        return <>
            <span>You do not have any notes.</span>,
            {me.roles.includes("createnote") ? <span><Link to="/new">Click Here</Link> to create one!</span> : null}
        </>
    }
    return <>
        <div className="notes-grid">
            {modal ? <DeleteModal id={id} name="Note" hook={useDeleteNoteMutation} onCompleted={hideModal}/> : null}
            {data.notes.map(({id, title, description})=>{
                return <Card key={id}>
                    <Card.Content>
                        <Card.Header>
                            {title}
                            <div className="controls">
                                {me.roles.includes("updatenote") ? <Icon className="far fa-pencil clickable" onClick={()=>edit(id)}/> : null}
                                {me.roles.includes("deletenote") ? <Icon className="far fa-trash clickable" onClick={()=>del(id)}/> : null}
                            </div>
                        </Card.Header>
                        <Card.Description>{description}</Card.Description>
                    </Card.Content>
                </Card>
            })} 
        </div>
        {me.roles.includes("createnote") ? <Button content="Create Note" icon={<Icon className="fal fa-plus"/>} labelPosition="right" onClick={create}/> : null}
    </>

}