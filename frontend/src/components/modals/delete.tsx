import React from 'react';
import {Button, Icon, Modal} from 'semantic-ui-react';


interface DeleteModalProps {
    id: any,
    hook: any,
    name: string,
    onCompleted: (success: boolean)=>{},
}

export default function DeleteModal (props: DeleteModalProps){
    const [del, {loading, error}] = props.hook();
    const run = async ()=>{
        await del({variables: {id: props.id}});
        props.onCompleted(true);
    }
    
    return <Modal size="mini" open>
        <Modal.Header>Delete {props.name}</Modal.Header>
        <Modal.Content>Are you sure you want to delete this {props.name}?</Modal.Content>
        <Modal.Actions>
            <Button negative content="No" onClick={()=>props.onCompleted(false)} disabled={loading}/>
            <Button positive content="Yes" icon={<Icon className="far fa-check"/>} labelPosition="right" onClick={run} disabled={loading} loading={loading}/>
        </Modal.Actions>
    </Modal>
    
}