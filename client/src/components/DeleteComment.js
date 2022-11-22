import React, { useState } from "react";
import { Button, Icon,Confirm } from "semantic-ui-react";

function DeleteComment({postId,onDelete,commentId}) {
    const [confirmOpen,setConfirmOpen] = useState(false)
    
  return (
    <>
    <Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
      <Icon name="trash" style={{ margin: 0 }} />
    </Button>
    <Confirm 
    onCancel={()=> setConfirmOpen(false)} 
    open={confirmOpen}
    onConfirm={async() =>{
        await setConfirmOpen(false)
        await onDelete(postId,commentId)
    }}
    content='Are you sure you want to delete post ?'
    />
    </>
  );
}

export default DeleteComment;
