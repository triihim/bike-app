import { usePage } from '../../common/hooks/usePage';
import { PaginationControls } from '../common/PaginationControls';
import { Spacer, SpacerDirection } from '../common/Spacer';
import { HeadingWithLoader } from '../common/HeadingWithLoader';
import { BikeStation } from './types';
import { ListItem, ListItemCell } from '../common/ListItem';
import { useNavigate } from 'react-router-dom';

export const BikeStationListView = () => {
  const pageSize = 10;
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
      <Spacer direction={SpacerDirection.Vertical} size={1.5} />
      {hasData &&
        page.data.map((bikeStation) => <BikeStationListItem key={bikeStation.id} bikeStation={bikeStation} />)}
      <Spacer direction={SpacerDirection.Vertical} size={1.5} />
      {controls}
    </div>
  );
};

interface BikeStationListItemProps {
  bikeStation: BikeStation;
}

const BikeStationListItem = ({ bikeStation }: BikeStationListItemProps) => {
  const navigate = useNavigate();
  return (
    <ListItem onClick={() => navigate(`/bike-stations/${bikeStation.id}`)}>
      <ListItemCell label="Name" value={bikeStation.name} />
      <ListItemCell label="Address" value={`${bikeStation.address}, ${bikeStation.city}`} />
      <ListItemCell label="Capacity" value={bikeStation.capacity} />
      <ListItemCell label="Operator" value={bikeStation.operator} />
    </ListItem>
  );
};
