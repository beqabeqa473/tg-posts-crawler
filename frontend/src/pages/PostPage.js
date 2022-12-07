import { useParams } from "react-router-dom"
import Post from "../components/Post";
import Posts from "../components/Posts";
import Blog from "../data.json"
import React from "react"

function PostPage() {
  const params = useParams()
  const postId = parseInt(params.id);
const post = Blog.posts.find(p => p.id === postId);
  return (
    <div className="SinglePost">
      <Post post={post} showLink={false}/>
    </div>
  );
}

export default PostPage;
