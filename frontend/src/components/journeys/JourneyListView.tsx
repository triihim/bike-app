import { Journey } from './types';
import { usePage } from '../../common/hooks/usePage';
import { PaginationControls } from '../common/PaginationControls';
import { Spacer, SpacerDirection } from '../common/Spacer';
import { HeadingWithLoader } from '../common/HeadingWithLoader';
import { assignFirstObjectProperty, metersToKilometers, secondsToMinutes } from '../../common/util';
import { Table } from '../common/Table';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { OrderBy } from '../../common/types';
import { OrderingButton } from '../common/OrderingButton';

export const JourneyListView = () => {
  const pageSize = 20;
  const [orderBy, setOrderBy] = useState<OrderBy>({
    departureStationName: 'ASC',
    returnStationName: 'ASC',
    coveredDistanceInMeters: 'DESC',
    durationInSeconds: 'DESC',
  });

  const { loading, page, hasMore, nextPage, previousPage, pageIndex, totalPageCount } = usePage<Journey>({
    pageSize,
    requestPath: '/journeys/page',
    orderBy,
  });

  const showNoJourneysMessage = !loading && !page;
  const hasData = page !== null;

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

  const toggleOrdering = (property: string) => {
    setOrderBy((ordering) => {
      const newPropertyOrdering = ordering[property] === 'ASC' ? 'DESC' : 'ASC';
      return assignFirstObjectProperty(ordering, property, newPropertyOrdering);
    });
  };

  return (
    <div>
      <HeadingWithLoader label="Journeys" loading={loading} />
      {showNoJourneysMessage && <p>No journeys available</p>}
      {controls}
      <Spacer direction={SpacerDirection.Vertical} size={3} />
      <Table>
        <thead>
          <tr>
            <th>
              Departure station
              <OrderingButton
                direction={orderBy.departureStationName}
                onClick={() => toggleOrdering('departureStationName')}
              />
            </th>
            <th>
              Return station
              <OrderingButton
                direction={orderBy.returnStationName}
                onClick={() => toggleOrdering('returnStationName')}
              />
            </th>
            <th>
              Distance (km)
              <OrderingButton
                direction={orderBy.coveredDistanceInMeters}
                onClick={() => toggleOrdering('coveredDistanceInMeters')}
              />
            </th>
            <th>
              Duration (min)
              <OrderingButton
                direction={orderBy.durationInSeconds}
                onClick={() => toggleOrdering('durationInSeconds')}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {hasData &&
            page.data.map((journey) => (
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
      </Table>
      <Spacer direction={SpacerDirection.Vertical} size={3} />
      {controls}
    </div>
  );
};
