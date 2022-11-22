import React, { useContext, useEffect, useState } from "react";
import { useQuery,useMutation } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import { FETCH_POST_QUERY, CREATE_POST_MUTATION, DELETE_POST } from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [values, setValues] = useState();
  const { loading, data } = useQuery(FETCH_POST_QUERY);
  const [deletePostId,setDeletePostId] = useState()

  useEffect(() => {
    if (data) {
      if (data?.getPosts) {
        setPosts(data?.getPosts);
      }
    }
  }, [data]);

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    async update(proxy, result) {
      const refetch = proxy.readQuery({
        query: FETCH_POST_QUERY,
      });
      let newData = [...refetch.getPosts];
      newData = [result.data.createPost, ...newData];

      await proxy.writeQuery({
        query: FETCH_POST_QUERY,
        data: {
          ...refetch,
          getPosts: {
            newData,
          },
        },
      });
      await setPosts([result.data.createPost, ...refetch.getPosts]);
    },
    variables: values,
  });

  const [deletePost] = useMutation(DELETE_POST,{
    async update(proxy,result){
        const refetch = proxy.readQuery({
          query: FETCH_POST_QUERY,
        });
        let newData = [...refetch.getPosts];
        // newData = [result.data.createPost, ...newData];
        newData = newData.filter(data => data.id !== deletePostId)
        newData = [...newData]
        await proxy.writeQuery({
          query: FETCH_POST_QUERY,
          data: {
            getPosts: {
              newData,
            },
          },
        });
        await setPosts([...newData]);
      },
    variables : {postId : deletePostId}
})
const onDeletePost = async(id) =>{
  await setDeletePostId(id)
  await deletePost()
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
                  <PostCard post={post} onDelete={onDeletePost} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
