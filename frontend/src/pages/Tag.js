import React from "react"
import Blog from "../data";
import Post from "../components/Post";
import Posts from "../components/Posts";
import { useParams } from "react-router-dom";


function Tag() {
        const params = useParams();
        const tagId = parseInt(params.id);
const tag = Blog.tags.find(t => t.id == tagId);
const postsForTag = Blog.posts.filter(post => post.tags.includes(tagId));
//const postsForTag = Blog.posts.filter(post => post.title != "");
//console.log(postsForTag);


return (
<div>
<h1>Просмотр постов по тегу {tag.tag}</h1>
      <Posts posts={postsForTag} />
</div>
)
}

export default Tag;
