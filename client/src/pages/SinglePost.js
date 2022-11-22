import React, { useContext, useRef, useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
  Button,
  Card,
  Grid,
  Icon,
  Label,
  Image,
  Form,
} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import DeletePost from "../components/DeletePost";
import { DELETE_COMMENT, DELETE_POST } from "../util/graphql";
import DeleteComment from "../components/DeleteComment";

function SinglePost() {
  const { user } = useContext(AuthContext);
  const [deletePostId, setDeletePostId] = useState();
  const [deleteCommentId, setDeleteCommentId] = useState();
  const [comment, setComment] = useState("");
  const { postId } = useParams();
  const commentInputRef = useRef(null)
  const { data } = useQuery(FETCH_SINGLE_POST_QUERY, {
    variables: { postId },
  });
  const [deletePost] = useMutation(DELETE_POST, {
    async update() {
      window.location.href = "/";
    },
    variables: { postId: deletePostId },
  });
  const [deleteComment] = useMutation(DELETE_COMMENT, {
    async update() {
      // window.location.href = "/"
    },
    variables: { postId, commentId: deleteCommentId },
  });
  const onDeletePost = async (id) => {
    await setDeletePostId(id);
    await deletePost();
  };

  const onDeleteComment = async (id, commentId) => {
    await setDeleteCommentId(commentId);
    await deleteComment();
  };

  const [submitComment] = useMutation(SUBMIT_COMMENT, {
    update() {
      setComment("");
      commentInputRef.current.blur()
    },
    variables: { postId, body: comment },
  });
  let postMarkup;
  if (data) {
    const { getPost } = data;
    if (!getPost) {
      postMarkup = <p>Loading Post...</p>;
    } else {
      const {
        id,
        body,
        createdAt,
        username,
        likeCount,
        likes,
        comments,
        commentCount,
      } = getPost;
      postMarkup = (
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              <Image
                src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                float="right"
                size="small"
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>{username}</Card.Header>
                  <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                  <Card.Description>{body}</Card.Description>
                  <hr />
                  <Card.Content extra>
                    <LikeButton user={user} post={{ id, likes, likeCount }} />
                    <Button
                      as="div"
                      labelPosition="right"
                    >
                      <Button basic color="blue">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                    {user && user.username === username && (
                      <DeletePost postId={id} onDelete={onDeletePost} />
                    )}
                  </Card.Content>
                </Card.Content>
              </Card>
              {user && (
                <Card fluid>
                 <Card.Content>
                 <p>Post a Comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={!comment.trim()}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                 </Card.Content>
                </Card>
              )}
              {comments.map((comment) => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteComment
                        postId={id}
                        commentId={comment.id}
                        onDelete={onDeleteComment}
                      />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>
                      {moment(comment.createdAt).fromNow(true)}
                    </Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
  }
  return <>{postMarkup}</>;
}

const FETCH_SINGLE_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const SUBMIT_COMMENT = gql`
  mutation createComments($postId: String!, $body: String!) {
    createComments(postId: $postId, body: $body) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

export default SinglePost;
