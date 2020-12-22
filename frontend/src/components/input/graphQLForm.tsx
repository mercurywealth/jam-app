import React, {MouseEvent, FunctionComponent, ComponentClass, ChangeEvent, Props, useState, useEffect} from 'react';
import { Button, Container, Form, Icon, Loader } from "semantic-ui-react";
import { Link, RouteComponentProps, useHistory, useRouteMatch } from 'react-router-dom';
import Error from '../layout/error';

type GraphQLFormField = {
    name: string,
    type?: string | FunctionComponent | ComponentClass<any, any>,
    props?: any,
}

interface GraphQLFormProps {
    title: string,
    className?: string,
    cancelURI?: string,
    fields: GraphQLFormField[],
    data?: {},
    config: {
        className: string,
        get: {
            hook: any,
        },
        update: {
            hook: any,
        },
        create: {
            hook: any,
        },
    }
    children?: React.ReactNode
}

// Reusable generic form class for creating/editing entities via our GraphQL API
function GraphQLForm(props: GraphQLFormProps){
    const match = useRouteMatch<{id: string}>();
    const history = useHistory();
    //State and setup
    const edit = match.params.id != null;
    var returnData = {};
    var [state, setState] = useState({
        data: {} as any,
    });

    //Apply the data from the query into the state
    const apply = function(data: any){
        setState({data: query.data[props.config.className]})
    }

    //Apollo Hooks
    var query: any = null;
    const [updateItem, update] = props.config.update.hook();
    const [addItem, add] = props.config.create.hook();

    //If there is an ID in the url, query for the data of that entity to prefill the inputs
    if (match.params.id){
        query = props.config.get.hook({variables: {id: match.params.id}, onCompleted: apply});
        if (query.loading) return <Container><Loader active/></Container>
        if (query.error) return <Container><Error graphQL={query.error}/></Container>;
    } 

    //Handle errors
    if (update.error) return <Container><Error graphQL={update.error}/></Container>
    if (add.error) return <Container><Error graphQL={add.error}/></Container>

    //Save (send data to GraphQL)
    const save = async function() {
        if (!props.data) props.data={};
        const mergedData = {data: {...props.data, ...state.data}, id: match.params.id}; //merge prop data with the input state data

        //Create/Update
        try {
            if (edit) await updateItem({variables: {...mergedData}});
            else await addItem({variables: {...mergedData}});
        }catch(e){}
    }

    //Back/Cancel
    const back = function() {
        history.push(props.cancelURI ? props.cancelURI : "../");
    }

    //Once the add or update operation is complete, show a completed status screen
    if (add.called || update.called){
        return <Container>
            <div className="form-end">
                <h1>{edit ? "Saved!" : "Created!"}</h1>
                <span>The new {props.config.className} has been sucessfully been {edit ? "saved" : "created"}.</span>
                <Button content="Back" onClick={back}/>
            </div>
        </Container>
    }

    
    //Render the form
    //return <GraphQLFormClass {...props} save={save} data={returnData} edit={edit} loading={add.loading || update.loading}/>
    return <Container className={props.className}>
        <h1>{edit ? "Edit" : "New"} {props.title}</h1>
        <Form>
            {
                props.fields.map((v: GraphQLFormField)=>{
                    if (v.props == undefined) v.props = {};
                    const fieldProps = Object.assign({}, v.props);
                    const onChange = v.props.onChange;
                    fieldProps.onChange = function(e: ChangeEvent) {
                        const target = e.target as HTMLInputElement;
                        var tmp = Object.assign({}, state.data);
                        tmp[v.name] = target.value;
                        setState({data: tmp});
                        if (onChange) onChange(e);
                    }
                    fieldProps.value = state.data[v.name] ? state.data[v.name] : "";
                    fieldProps.key = v.name;
                    if (typeof v.type == "string"){
                        fieldProps.type = v.type;
                        return React.createElement(Form.Input, fieldProps);
                    }else if (v.type){
                        return React.createElement(v.type, fieldProps)
                    }else{
                        return React.createElement(Form.Input, fieldProps);
                    }
                    
                })
            }
            <Form.Group className="form-right">
                <Button type="button" content="Cancel" onClick={back}/>
                <Button content={edit ? "Save" : "Create"} icon={<Icon className={"fas " + (edit ? "fa-save" : "fa-check")}/>} 
                    labelPosition="right" positive onClick={save} loading={add.loading || update.loading}/>
            </Form.Group>
        </Form>
        {props.children}
    </Container>
}
export default GraphQLForm;