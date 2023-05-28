import { useState, useEffect } from 'react';
import { PageResponse, usePageParams } from '../types';
import { useGetRequest } from './useGetRequest';

export const usePage = <T>({ pageSize, requestPath, initialPage, orderBy }: usePageParams) => {
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(initialPage || 1);
  const [totalPageCount, setTotalPageCount] = useState(0);

  const orderingQuery = orderBy ? `&orderBy=${JSON.stringify(orderBy)}` : '';

  const request = `${requestPath}?start=${start}&limit=${pageSize}${orderingQuery}`;

  const { loading, data: page, error } = useGetRequest<PageResponse<T>>(request);

  useEffect(() => {
    if (page && page.count) {
      setHasMore(start + pageSize < page.count);
      setTotalPageCount(Math.ceil(page.count / pageSize) - 1);
    }
  }, [page]);

  const nextPage = () => {
    goToPage(pageIndex + 1);
  };

  const previousPage = () => {
    goToPage(pageIndex - 1);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPageCount) return;
    setStart((page - 1) * pageSize);
    setPageIndex(page);
  };

  return { loading, page, hasMore, error, pageIndex, totalPageCount, pageSize, goToPage, nextPage, previousPage };
};
