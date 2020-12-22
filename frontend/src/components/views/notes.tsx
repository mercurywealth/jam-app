import React, {useState, useMemo, useEffect} from 'react';
import { Loader, Card, Button, Icon } from 'semantic-ui-react';
import Error from '../layout/error';
import { useGetNotesQuery } from '../../graphql/note/__generated__/getnotes.generated';
import { useHistory, Link } from 'react-router-dom';
import DeleteModal from '../modals/delete';
import { useDeleteNoteMutation } from '../../graphql/note/__generated__/deletenote.generated';

import "./notes.css";

interface NotesProps {
}

export default function Notes (props: NotesProps){
    //Setup Hooks
    //var [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [id, setID] = useState(null);
    const history = useHistory();
    const { loading, error, data, refetch, fetchMore, startPolling, stopPolling} = useGetNotesQuery();
    useEffect(()=>{
        //refetch();
        stopPolling()
        startPolling(1000);
    }, [refetch]);
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
        return {};
    }


    if (!data){
        return <>
            <span>You do not have any notes.</span>,
            <span><Link to="/new">Click Here</Link> to create one!</span>
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
                                <Icon className="far fa-pencil clickable" onClick={()=>edit(id)}/>
                                <Icon className="far fa-trash clickable" onClick={()=>del(id)}/>
                            </div>
                        </Card.Header>
                        <Card.Description>{description}</Card.Description>
                    </Card.Content>
                </Card>
            })} 
        </div>
        <Button content="Create Note" icon={<Icon className="fal fa-plus"/>} labelPosition="right" onClick={create}/>
    </>

}