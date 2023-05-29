import { Link } from 'react-router-dom';
import { usePage } from '../../../common/hooks/usePage';
import { HeadingWithLoader } from '../../common/HeadingWithLoader';
import { PaginationControls } from '../../common/PaginationControls';
import { Spacer, SpacerDirection } from '../../common/Spacer';
import { BikeStation } from '../types';
import { Table } from '../../common/Table';
import { useState } from 'react';
import { OrderBy } from '../../../common/types';
import { OrderingButton } from '../../common/OrderingButton';
import { assignFirstObjectProperty } from '../../../common/util';

export const BikeStationListView = () => {
  const pageSize = 20;
  const [orderBy, setOrderBy] = useState<OrderBy>({ name: 'ASC', address: 'ASC' });
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

  const toggleOrdering = (property: string) => {
    setOrderBy((ordering) => {
      const newPropertyOrdering = ordering[property] === 'ASC' ? 'DESC' : 'ASC';
      return assignFirstObjectProperty(ordering, property, newPropertyOrdering);
    });
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
          {hasData && <BikeStationsTable bikeStations={page?.data} orderBy={orderBy} toggleOrdering={toggleOrdering} />}
          <Spacer direction={SpacerDirection.Vertical} size={3} />
          {controls}
        </>
      )}
    </div>
  );
};

interface BikeStationsTableProps {
  bikeStations: Array<BikeStation>;
  orderBy: OrderBy;
  toggleOrdering: (property: string) => void;
}

const BikeStationsTable = (props: BikeStationsTableProps) => {
  const { bikeStations, orderBy, toggleOrdering } = props;
  return (
    <Table>
      <thead>
        <tr>
          <th>
            Name
            <OrderingButton direction={orderBy.name} onClick={() => toggleOrdering('name')} />
          </th>
          <th>
            Address
            <OrderingButton direction={orderBy.address} onClick={() => toggleOrdering('address')} />
          </th>
          <th>
            Capacity
            <OrderingButton direction={orderBy.capacity} onClick={() => toggleOrdering('capacity')} />
          </th>
          <th>Operator</th>
        </tr>
      </thead>
      <tbody>
        {bikeStations.map((bikeStation) => (
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
  );
};
