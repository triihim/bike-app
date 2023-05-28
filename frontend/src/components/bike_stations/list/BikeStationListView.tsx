import { Link } from 'react-router-dom';
import { usePage } from '../../../common/hooks/usePage';
import { HeadingWithLoader } from '../../common/HeadingWithLoader';
import { PaginationControls } from '../../common/PaginationControls';
import { Spacer, SpacerDirection } from '../../common/Spacer';
import { BikeStation } from '../types';
import { Table } from '../../common/Table';

export const BikeStationListView = () => {
  const pageSize = 20;
  const { loading, page, hasMore, nextPage, previousPage, pageIndex, totalPageCount } = usePage<BikeStation>(
    pageSize,
    '/bike-station/page',
  );

  const showNoBikeStations = !loading && !page;
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
      <HeadingWithLoader label="Bike Stations" loading={loading} />
      {showNoBikeStations && <p>No bike stations available</p>}
      {controls}
      <Spacer direction={SpacerDirection.Vertical} size={3} />
      {hasData && (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Capacity</th>
              <th>Operator</th>
            </tr>
          </thead>
          <tbody>
            {page.data.map((bikeStation) => (
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
        </Table>
      )}
      <Spacer direction={SpacerDirection.Vertical} size={3} />
      {controls}
    </div>
  );
};
