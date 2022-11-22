import React, { useContext } from "react";
import {Card,Icon,Label,Image,Button} from "semantic-ui-react"
import moment from "moment";
import {Link} from "react-router-dom"
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton"
import DeletePost from "./DeletePost";
function PostCard({onDelete,post: {body, createdAt, id,username,likeCount,commentCount,comments,likes}}){
  const {user} = useContext(AuthContext)
    return(
    <Card fluid>
    <Card.Content>
      <Image
        floated='right'
        size='mini'
        src='https://react.semantic-ui.com/images/avatar/large/molly.png'
      />
      <Card.Header>{username}</Card.Header>
      <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
      <Card.Description>{body}</Card.Description>
    </Card.Content>
    <Card.Content extra>
   <LikeButton post={{id,likes,likeCount}} user={user}/>

    <Button as={Link} labelPosition='right' to={`/posts/${id}`}>
    <Button color='blue' basic>
        <Icon name='comments' />
      </Button>
      <Label as='a' basic color='blue' pointing='left'>
        {commentCount}
      </Label>
    </Button>
    {
      user && user.username === username && (
       <DeletePost postId={id} onDelete={onDelete}/>
      )
    }
    </Card.Content>
  </Card>
   )
} 

export default PostCard