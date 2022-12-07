import React, { useState, useMemo } from 'react';
import Pagination from './Pagination';
import Post from './Post';

let PageSize = 10;
const Posts = (props) => {

  const [currentPage, setCurrentPage] = useState(1);
  const currentPosts = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return props.posts.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  const postsJSX = currentPosts.map((post, index) => (
    <div className="summary">
      <Post post={post} showLink={true}/>
    </div>
  ));


  return (
<div>
<p>Страница {currentPage} из {Math.ceil(props.posts.length / PageSize)}</p>
<div className="posts">{postsJSX}</div>
      <Pagination currentPage={currentPage} totalCount={props.posts.length} pageSize={PageSize} onPageChange={page => setCurrentPage(page)} />
</div>
)
};

export default Posts;