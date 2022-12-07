import React from 'react';
import { usePagination, DOTS } from '../hooks/usePagination';
const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
<nav aria-label="Постраничная навигация">
    <ul>
      <li>
        <button  disabled={currentPage === 1} onClick={onPrevious}>Назад</button>
      </li>
      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return <li>&#8230;</li>;
        }

        return (
          <li>
            <button aria-current={pageNumber === currentPage} onClick={() => onPageChange(pageNumber)}>{pageNumber}</button>
          </li>
        );
      })}
      <li>
        <button disabled={currentPage === lastPage} onClick={onNext}>В перед</button>
      </li>
    </ul>
</nav>
  );
};

export default Pagination;
