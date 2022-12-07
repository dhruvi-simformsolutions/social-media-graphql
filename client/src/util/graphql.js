import gql from "graphql-tag";

export const FETCH_POST_QUERY = gql`
{
  getPosts {
    id
    body
    createdAt
    username
    likeCount
    likes {
      username
    }
    commentCount
    comments {
      id
      username
      createdAt
      body
    }
  }
}
`;

export const CREATE_POST_MUTATION = gql`
mutation createPost(
  $body: String!
) {
  createPost(
      body: $body
  ) {
   id body createdAt username 
   likes{
       id
       username
       createdAt
   }
   likeCount
   commentCount
   comments{
       id body username createdAt
   }
  }
}
`;

export const DELETE_POST= gql `
mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
}
`;

export const DELETE_COMMENT= gql `
mutation deleteComment($postId: ID!, $commentId: ID!){
  deleteComment(postId: $postId, commentId: $commentId){
    id body createdAt username 
   likes{
       id
       username
       createdAt
   }
   likeCount
   commentCount
   comments{
       id body username createdAt
   }
  }
}
`;

export const EDIT_POST= gql `
mutation updatePost($postId: ID!,$body: String!){
  updatePost(postId: $postId,body: $body){
    id body createdAt username 
   likes{
       id
       username
       createdAt
   }
   likeCount
   commentCount
   comments{
       id body username createdAt
   }
  }
}
`;
