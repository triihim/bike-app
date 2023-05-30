import { Journey } from './types';
import { usePage } from '../../common/hooks/usePage';
import { PaginationControls } from '../common/PaginationControls';
import { Spacer, SpacerDirection } from '../common/Spacer';
import { HeadingWithLoader } from '../common/HeadingWithLoader';
import { metersToKilometers, secondsToMinutes } from '../../common/util';
import { ColumnHeader, StyledTable, TableProps } from '../common/Table';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { OrderBy } from '../../common/types';

export const JourneyListView = () => {
  const pageSize = 20;
  const [orderBy, setOrderBy] = useState<OrderBy<Journey>>({ property: 'departureStationName', direction: 'ASC' });

  const { loading, page, hasMore, nextPage, previousPage, pageIndex, totalPageCount } = usePage<Journey>({
    pageSize,
    requestPath: '/journeys/page',
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

  const orderByColumn = (orderBy: OrderBy<Journey>) => {
    setOrderBy(orderBy);
  };

  return (
    <div>
      <HeadingWithLoader label="Journeys" loading={loading} />
      {!hasData && !loading ? (
        <p>No journeys available</p>
      ) : (
        <>
          {controls}
          <Spacer direction={SpacerDirection.Vertical} size={3} />
          {hasData && <JourneyTable rows={page?.data} orderBy={orderBy} orderByColumn={orderByColumn} />}
          <Spacer direction={SpacerDirection.Vertical} size={3} />
          {controls}
        </>
      )}
    </div>
  );
};

const JourneyTable = (props: TableProps<Journey>) => {
  const { rows, orderBy, orderByColumn } = props;
  return (
    <StyledTable>
      <thead>
        <tr>
          <ColumnHeader<Journey>
            label="Departure station"
            orderable={{ property: 'departureStationName', currentOrdering: orderBy, orderByColumn }}
          />
          <ColumnHeader<Journey>
            label="Return station"
            orderable={{ property: 'returnStationName', currentOrdering: orderBy, orderByColumn }}
          />
          <ColumnHeader<Journey>
            label="Distance (km)"
            orderable={{ property: 'coveredDistanceInMeters', currentOrdering: orderBy, orderByColumn }}
          />
          <ColumnHeader<Journey>
            label="Duration (min)"
            orderable={{ property: 'durationInSeconds', currentOrdering: orderBy, orderByColumn }}
          />
        </tr>
      </thead>
      <tbody>
        {rows.map((journey) => (
          <tr key={journey.id}>
            <td>
              <Link to={`/bike-stations/${journey.departureStationId}`}>{journey.departureStationName}</Link>
            </td>
            <td>
              <Link to={`/bike-stations/${journey.returnStationId}`}>{journey.returnStationName}</Link>
            </td>
            <td>{metersToKilometers(journey.coveredDistanceInMeters)}</td>
            <td>{secondsToMinutes(journey.durationInSeconds)}</td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};
