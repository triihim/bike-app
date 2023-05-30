export interface PageResponse<T> {
  data: Array<T>;
  count: number;
}

export interface OrderBy<T> {
  property: keyof T;
  direction: 'ASC' | 'DESC';
}

export interface usePageParams<T> {
  pageSize: number;
  requestPath: string;
  initialPage?: number;
  orderBy?: OrderBy<T>;
}
