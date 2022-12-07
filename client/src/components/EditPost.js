import React, { useState } from "react";
import { Button, Icon,Modal,Form } from "semantic-ui-react";

function EditPost({onEdit,postbody,postId}) {
    const [confirmOpen,setConfirmOpen] = useState(false)
    const [values, setValues] = useState({
        body: postbody,
        id : postId
      });
    const onChange = (event) =>{
        setValues({ ...values, [event.target.name]: event.target.value });
    }
    const onEditPost = async (event) => {
        event.preventDefault();
        await onEdit(values);
        await setConfirmOpen(false)
      };
  return (
    <>
    <Button as="div" color="teal" floated="right" onClick={() => setConfirmOpen(true)}>
      <span title="Edit"><Icon name="edit" style={{ margin: 0 }} /></span>
    </Button>
    <Modal
    onClose={() => setConfirmOpen(false)}
    onOpen={() => setConfirmOpen(true)}
    open={confirmOpen}
    >
        <Modal.Header>Update Post</Modal.Header>
        <Modal.Content>
        <Form>
            <Form.Field>
                <Form.Input placeholder = "Hi World!"
                name="body"
                onChange={onChange}
                value = {values.body}
                />
            </Form.Field>
        </Form>
        </Modal.Content>
        <Modal.Actions>
        <Button type="submit" color="teal" disabled={!values.body.trim()} onClick={onEditPost}>Update</Button>
        </Modal.Actions>
    </Modal>
    </>
  );
}

export default EditPost;
