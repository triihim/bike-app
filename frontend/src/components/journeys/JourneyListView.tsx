import { Journey } from './types';
import { usePage } from '../../common/hooks/usePage';
import { PaginationControls } from '../common/PaginationControls';
import { Spacer, SpacerDirection } from '../common/Spacer';
import { HeadingWithLoader } from '../common/HeadingWithLoader';
import { metersToKilometers, secondsToMinutes } from '../../common/util';
import { Table } from '../common/Table';
import { Link } from 'react-router-dom';

export const JourneyListView = () => {
  const pageSize = 20;
  const { loading, page, hasMore, nextPage, previousPage, pageIndex, totalPageCount } = usePage<Journey>({
    pageSize,
    requestPath: '/journey/page',
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

  return (
    <div>
      <HeadingWithLoader label="Journeys" loading={loading} />
      {showNoJourneysMessage && <p>No journeys available</p>}
      {controls}
      <Spacer direction={SpacerDirection.Vertical} size={3} />
      <Table>
        <thead>
          <tr>
            <th>Departure station</th>
            <th>Return station</th>
            <th>Distance (km)</th>
            <th>Duration (min)</th>
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
