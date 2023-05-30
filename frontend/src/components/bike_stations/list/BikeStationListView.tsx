import { Link } from 'react-router-dom';
import { usePage } from '../../../common/hooks/usePage';
import { HeadingWithLoader } from '../../common/HeadingWithLoader';
import { PaginationControls } from '../../common/PaginationControls';
import { Spacer, SpacerDirection } from '../../common/Spacer';
import { BikeStation } from '../types';
import { ColumnHeader, StyledTable, TableProps } from '../../common/Table';
import { useState } from 'react';
import { FilterBy, OrderBy } from '../../../common/types';

export const BikeStationListView = () => {
  const pageSize = 20;
  const [orderBy, setOrderBy] = useState<OrderBy<BikeStation>>({ property: 'name', direction: 'ASC' });
  const [filters, setFilters] = useState<Array<FilterBy<BikeStation>>>([]);

  const { loading, page, hasMore, nextPage, previousPage, pageIndex, totalPageCount } = usePage<BikeStation>({
    pageSize,
    requestPath: '/bike-stations/page',
    orderBy,
    filterBy: filters,
  });

  const controls = (
    <PaginationControls
      onNext={nextPage}
      onPrevious={previousPage}
      nextDisabled={!hasMore || loading}
      previousDisabled={pageIndex === 1 || loading}
      currentPageIndex={pageIndex}
      totalPages={totalPageCount}
    />
  );

  const orderByColumn = (orderBy: OrderBy<BikeStation>) => {
    setOrderBy(orderBy);
  };

  const filterByValue = (filterBy: FilterBy<BikeStation>) => {
    setFilters((currentFilters) =>
      currentFilters.filter((filter) => filter.property !== filterBy.property).concat(filterBy),
    );
  };

  return (
    <div>
      <HeadingWithLoader label="Bike Stations" loading={loading} />
      <>
        {controls}
        <Spacer direction={SpacerDirection.Vertical} size={3} />
        <BikeStationsTable
          rows={page?.data}
          orderBy={orderBy}
          orderByColumn={orderByColumn}
          filterByValue={filterByValue}
        />
        <Spacer direction={SpacerDirection.Vertical} size={3} />
        {controls}
      </>
    </div>
  );
};

const BikeStationsTable = (props: TableProps<BikeStation>) => {
  const { rows, orderBy, orderByColumn, filterByValue } = props;
  return (
    <StyledTable>
      <thead>
        <tr>
          <ColumnHeader<BikeStation>
            label="Name"
            property="name"
            orderable={{ currentOrdering: orderBy, orderByColumn }}
            filterByValue={filterByValue}
          />
          <ColumnHeader<BikeStation>
            label="Address"
            property="address"
            orderable={{ currentOrdering: orderBy, orderByColumn }}
            filterByValue={filterByValue}
          />
          <ColumnHeader<BikeStation>
            label="Capacity"
            property="capacity"
            orderable={{ currentOrdering: orderBy, orderByColumn }}
          />
          <ColumnHeader<BikeStation>
            label="Operator"
            property="operator"
            orderable={{ currentOrdering: orderBy, orderByColumn }}
          />
        </tr>
      </thead>
      <tbody>
        {rows?.map((bikeStation) => (
          <tr key={bikeStation.id}>
            <td>
              <Link to={`/bike-stations/${bikeStation.id}`}>{bikeStation.name}</Link>
            </td>
            <td>
              {bikeStation.address}, {bikeStation.city}
            </td>
            <td>{bikeStation.capacity}</td>
            <td>{bikeStation.operator}</td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};
