import Post from "../components/Post";
import Posts from "../components/Posts";
import Blog from "../data.json"
import React from "react"

function Home() {

  return (
    <div className="App">
      <h1>My Blog</h1>
      <Posts posts={Blog.posts} />
    </div>
  );
}

export default Home;
