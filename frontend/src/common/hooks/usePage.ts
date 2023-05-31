import { useState, useEffect, useRef } from 'react';
import { FilterBy, OrderBy, PageResponse, usePageParams } from '../types';
import { useGetRequest } from './useGetRequest';

const emptyFilterValues = <T>(filterBy: FilterBy<T>) => filterBy.value.trim().length > 0;

const appendFilterValue = <T>(queryString: string, filter: FilterBy<T>) =>
  queryString + `&filterColumn=${filter.property.toString()}&filterValue=${filter.value}`;

const buildOrderingQueryString = <T>(orderBy?: OrderBy<T>) =>
  orderBy ? `&sortColumn=${orderBy.property.toString()}&sortDirection=${orderBy.direction}` : '';

const buildFilteringQueryString = <T>(filterBy?: Array<FilterBy<T>>) =>
  filterBy ? filterBy.filter(emptyFilterValues).reduce(appendFilterValue, '') : '';

const buildPageRequest = <T>(
  path: string,
  start: number,
  pageSize: number,
  orderBy?: OrderBy<T>,
  filterBy?: Array<FilterBy<T>>,
) =>
  `${path}?start=${start}&limit=${pageSize}${buildOrderingQueryString(orderBy)}${buildFilteringQueryString(filterBy)}`;

export const usePage = <T>({ pageSize, requestPath, initialPage, orderBy, filterBy }: usePageParams<T>) => {
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(initialPage || 1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [request, setRequest] = useState(`${requestPath}?start=${start}&limit=${pageSize}`);
  const filteringChanged = useRef(false);
  const { loading, data: page, error } = useGetRequest<PageResponse<T>>(request);

  useEffect(() => {
    filteringChanged.current = true;
  }, [filterBy]);

  useEffect(() => {
    let newRequest: string;
    if (filteringChanged.current === true) {
      filteringChanged.current = false;
      newRequest = buildPageRequest(requestPath, 0, pageSize, orderBy, filterBy);
      goToPage(1);
    } else {
      newRequest = buildPageRequest(requestPath, start, pageSize, orderBy, filterBy);
    }
    setRequest(newRequest);
  }, [pageSize, requestPath, orderBy, filterBy, start, pageIndex]);

  useEffect(() => {
    if (page && page.count) {
      setHasMore(start + pageSize < page.count);
      setTotalPageCount(Math.max(1, Math.ceil(page.count / pageSize)));
    }
  }, [page]);

  useEffect(() => {
    if (pageIndex > totalPageCount) {
      setPageIndex(Math.max(1, totalPageCount));
    }
  }, [totalPageCount]);

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
