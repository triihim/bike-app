import { Journey } from './types';
import { usePage } from '../../common/hooks/usePage';
import { PaginationControls } from '../common/PaginationControls';
import { Spacer, SpacerDirection } from '../common/Spacer';
import { HeadingWithLoader } from '../common/HeadingWithLoader';
import { metersToKilometers, secondsToMinutes } from '../../common/util';
import { ColumnHeader, StyledTable, TableProps } from '../common/Table';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { FilterBy, OrderBy } from '../../common/types';
import { NotificationContext, NotificationType } from '../Notification';
import { PrimaryButton } from '../common/PrimaryButton';
import { ModalContext } from '../Modal';
import { JourneyModal } from './JourneyModal';

export const JourneyListView = () => {
  const pageSize = 20;
  const [orderBy, setOrderBy] = useState<OrderBy<Journey>>({ property: 'departureStationName', direction: 'ASC' });
  const [filters, setFilters] = useState<Array<FilterBy<Journey>>>([]);
  const { showNotification } = useContext(NotificationContext);
  const { setModalContent } = useContext(ModalContext);

  const { loading, page, hasMore, nextPage, previousPage, pageIndex, totalPageCount, error } = usePage<Journey>({
    pageSize,
    requestPath: '/journeys/page',
    orderBy,
    filterBy: filters,
  });

  useEffect(() => {
    if (error) {
      showNotification(
        'Something went wrong and journeys could not be fetched, maybe the data import is still in progress',
        NotificationType.Error,
      );
    }
  }, [error]);

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

  const filterByValue = (filterBy: FilterBy<Journey>) => {
    setFilters((currentFilters) =>
      currentFilters.filter((filter) => filter.property !== filterBy.property).concat(filterBy),
    );
  };

  const onAddJourneyClick = () => {
    setModalContent(<JourneyModal onCancel={() => setModalContent(null)} />);
  };

  return (
    <div>
      <HeadingWithLoader label="Journeys" loading={loading} />
      <PrimaryButton onClick={onAddJourneyClick}>Add journey</PrimaryButton>
      {controls}
      <Spacer direction={SpacerDirection.Vertical} size={3} />
      <JourneyTable rows={page?.data} orderBy={orderBy} orderByColumn={orderByColumn} filterByValue={filterByValue} />
      <Spacer direction={SpacerDirection.Vertical} size={3} />
      {controls}
    </div>
  );
};

const JourneyTable = (props: TableProps<Journey>) => {
  const { rows, orderBy, orderByColumn, filterByValue } = props;
  return (
    <StyledTable>
      <thead>
        <tr>
          <ColumnHeader<Journey>
            label="Departure station"
            property="departureStationName"
            orderable={{ currentOrdering: orderBy, orderByColumn }}
            filterByValue={filterByValue}
          />
          <ColumnHeader<Journey>
            label="Return station"
            property="returnStationName"
            orderable={{ currentOrdering: orderBy, orderByColumn }}
            filterByValue={filterByValue}
          />
          <ColumnHeader<Journey>
            label="Distance (km)"
            property="coveredDistanceInMeters"
            orderable={{ currentOrdering: orderBy, orderByColumn }}
          />
          <ColumnHeader<Journey>
            label="Duration (min)"
            property="durationInSeconds"
            orderable={{ currentOrdering: orderBy, orderByColumn }}
          />
        </tr>
      </thead>
      <tbody>
        {rows?.map((journey) => (
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
