import React, { useState } from "react";
import {Form,Button} from "semantic-ui-react"
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POST_QUERY } from "../util/graphql";

function PostForm({onSubmit}) {
    const [values, setValues] = useState({
        body: ""
      });
    const onChange = (event) =>{
        setValues({ ...values, [event.target.name]: event.target.value });
    }
   
      const onSubmitForm = async (event) => {
        event.preventDefault();
        await onSubmit(values);
        await setValues({
          body: ""
        });
      };
    return (
        <Form onSubmit={onSubmitForm}>
            <h2>Create a post:</h2>
            <Form.Field>
                <Form.Input placeholder = "Hi World!"
                name="body"
                onChange={onChange}
                value = {values.body}
                />
                <Button type="submit" color="teal" disabled={!values.body.trim()}>Submit</Button>
            </Form.Field>
        </Form>
    )
}

export default PostForm;