import { Link } from 'react-router-dom';
import { usePage } from '../../../common/hooks/usePage';
import { HeadingWithLoader } from '../../common/HeadingWithLoader';
import { PaginationControls } from '../../common/PaginationControls';
import { Spacer, SpacerDirection } from '../../common/Spacer';
import { BikeStation } from '../types';
import { ColumnHeader, StyledTable, TableProps } from '../../common/Table';
import { useState } from 'react';
import { OrderBy } from '../../../common/types';

export const BikeStationListView = () => {
  const pageSize = 20;
  const [orderBy, setOrderBy] = useState<OrderBy<BikeStation>>({ property: 'name', direction: 'ASC' });
  const { loading, page, hasMore, nextPage, previousPage, pageIndex, totalPageCount } = usePage<BikeStation>({
    pageSize,
    requestPath: '/bike-stations/page',
    orderBy,
  });

  const hasData = page !== null && page.count > 0;

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

  return (
    <div>
      <HeadingWithLoader label="Bike Stations" loading={loading} />
      {!hasData && !loading ? (
        <p>No bike stations available</p>
      ) : (
        <>
          {controls}
          <Spacer direction={SpacerDirection.Vertical} size={3} />
          {hasData && <BikeStationsTable rows={page?.data} orderBy={orderBy} orderByColumn={orderByColumn} />}
          <Spacer direction={SpacerDirection.Vertical} size={3} />
          {controls}
        </>
      )}
    </div>
  );
};

const BikeStationsTable = (props: TableProps<BikeStation>) => {
  const { rows, orderBy, orderByColumn } = props;
  return (
    <StyledTable>
      <thead>
        <tr>
          <ColumnHeader<BikeStation>
            label="Name"
            orderable={{ property: 'name', currentOrdering: orderBy, orderByColumn }}
          />
          <ColumnHeader<BikeStation>
            label="Address"
            orderable={{ property: 'address', currentOrdering: orderBy, orderByColumn }}
          />
          <ColumnHeader<BikeStation>
            label="Capacity"
            orderable={{ property: 'capacity', currentOrdering: orderBy, orderByColumn }}
          />
          <ColumnHeader<BikeStation>
            label="Operator"
            orderable={{ property: 'operator', currentOrdering: orderBy, orderByColumn }}
          />
        </tr>
      </thead>
      <tbody>
        {rows.map((bikeStation) => (
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
