import Blog from "../data";
import { Link } from "react-router-dom";


Blog.tags.sort((a, b) => {
a = a.tag.toLowerCase();
b = b.tag.toLowerCase();
if (a < b) {
return -1;
}
if (a > b) {
return 1;
}
return 0;
});

const postCount = (tagID) => Blog.posts.filter(post => post.tags.includes(tagID)).length;

function Tags() {
return (
<div>
<h1>Список тегов</h1>
    <ul>
{
  Blog.tags.map((tag) => (
      <li key={tag.id}>
<Link to={`/tags/${tag.id}`}>{tag.tag} {postCount(tag.id)} постов</Link>
</li>
  )
)
}
</ul>
</div>
)
}

export default Tags;
