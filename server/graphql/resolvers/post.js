const Post = require("../../models/Post");
const checkAuth = require("../../utils/check_auth");
const {AuthenticationError,UserInputError} = require('apollo-server')
module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({createdAt : -1});
        return posts;
      } catch (e) {
        throw new Error(e);
      }
    },
    async getPost(_, { postId }) {
      try {
        const posts = await Post.findById(postId);
        if (posts) {
          return posts;
        } else {
          throw new Error("Post Not Found");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);
      if(body.trim() === "") throw new Error('Post Body must not be empty')
      const newPost = new Post({
          body,
          user : user.id,
          username : user.username,
          createdAt : new Date().toISOString()
      });
      const post = await newPost.save();
      return post;
    },
    async deletePost(_,{postId},context){
      const user = checkAuth(context);
      try{
        const post = await Post.findById(postId);
        if(user.username === post.username){
          await post.delete();
          return "Post Deleted Successfully"
        } else{
          throw new AuthenticationError('Action Not Allowed')
        }
      } catch(err){
        throw new Error(err)
      }
    },
    async likePost(_,{postId},context){
      const {username} = checkAuth(context);
      const post = await Post.findById(postId);
      if(post){
        if(post.likes.find(like => like.username === username)){
          post.likes = post.likes.filter(like => like.username !== username)
        } else{
          post.likes.push({
            username,
            createdAt : new Date().toISOString()
          })
        }
        await post.save()
        return post
      } else{
        throw new UserInputError('Post Not Found')
      }
    }
  },
};
