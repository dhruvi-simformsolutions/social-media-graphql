import React, { useContext, useEffect, useState } from "react";
import { useQuery,useMutation } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import { FETCH_POST_QUERY, CREATE_POST_MUTATION, DELETE_POST, EDIT_POST } from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [values, setValues] = useState();
  const { loading, data } = useQuery(FETCH_POST_QUERY);
  const [postId,setPostId] = useState()
  const [body,setBody] = useState("")
  useEffect(() => {
    if (data) {
      if (data?.getPosts) {
        setPosts(data?.getPosts);
      }
    }
  }, [data]);

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    refetchQueries: [
      {query: FETCH_POST_QUERY}, // DocumentNode object parsed with gql
      'getPosts' // Query name
    ],
    variables: values,
  });

  const [deletePost] = useMutation(DELETE_POST,{
    refetchQueries: [
      {query: FETCH_POST_QUERY}, // DocumentNode object parsed with gql
      'getPosts' // Query name
    ],
    variables : {postId : postId}
})
const onDeletePost = async(id) =>{
  await setPostId(id)
  await deletePost()
}

const [editPost] = useMutation(EDIT_POST,{
  refetchQueries: [
    {query: FETCH_POST_QUERY}, // DocumentNode object parsed with gql
    'getPosts' // Query name
  ],
  variables : {postId : postId, body : body}
})

const onEdit = async(values) =>{
  await setPostId(values.id)
  await setBody(values.body)
  await editPost()
}
  const onSubmit = async (value) => {
    await setValues(value);
    await createPost();
  };
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user ? (
          <Grid.Column>
            <PostForm onSubmit={onSubmit} />
          </Grid.Column>
        ) : null}
        {loading ? (
          <h1>Loading Posts...</h1>
        ) : (
          <Transition.Group>
            {posts &&
              posts.map((post, index) => (
                <Grid.Column key={index} style={{ marginBottom: "20px" }}>
                  <PostCard post={post} onDelete={onDeletePost} onEdit={onEdit}/>
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
