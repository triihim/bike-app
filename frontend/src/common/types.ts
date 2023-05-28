export interface PageResponse<T> {
  data: Array<T>;
  count: number;
}

export interface OrderBy {
  [property: string]: 'ASC' | 'DESC';
}

export interface usePageParams {
  pageSize: number;
  requestPath: string;
  initialPage?: number;
  orderBy?: OrderBy;
}
