import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useGetRequest } from '../../../common/hooks/useGetRequest';
import { metersToKilometers } from '../../../common/util';
import { CenteredLoader } from '../../common/Loader';
import { Spacer, SpacerDirection } from '../../common/Spacer';
import { BikeStationStatistics, BikeStationPopularity } from '../types';

export const StatisticsSection = ({ bikeStationId }: { bikeStationId: number }) => {
  const { loading, data } = useGetRequest<BikeStationStatistics>(`/bike-stations/${bikeStationId}/statistics`);

  if (loading) return <CenteredLoader />;

  if (!data) return <p>No statistics available</p>;

  return (
    <>
      <AggregatesSectionWrapper>
        <AggregateTile label="Journeys started from here" value={data.aggregates.journeys_starting_from_station} />
        <AggregateTile label="Journeys ended here" value={data.aggregates.journeys_returning_to_station} />
        <AggregateTile
          label="Average distance of a journey started from here"
          value={metersToKilometers(data.aggregates.departuring_journeys_avg_distance_in_meters) + 'km'}
        />
        <AggregateTile
          label="Average distance of a journey ended here"
          value={metersToKilometers(data.aggregates.returning_journeys_avg_distance_in_meters) + 'km'}
        />
      </AggregatesSectionWrapper>
      <Spacer direction={SpacerDirection.Vertical} size={2} />
      <PopularitySection>
        <PopularityTable label="Top destinations of journeys started from here" data={data.topDeparturesTo} />
        <PopularityTable label="Top origins of journeys ended here" data={data.topReturnsFrom} />
      </PopularitySection>
    </>
  );
};

const AggregateTile = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <AggregateTileWrapper>
      <span className="value">{value}</span>
      <h4 className="label">{label}</h4>
    </AggregateTileWrapper>
  );
};

const AggregateTileWrapper = styled.div`
  flex: 1;

  & .label {
    margin: 0;
    color: ${(props) => props.theme.colors.textDarkVariant};
    font-weight: 200;
  }

  & .value {
    font-size: 2.5rem;
  }
`;

const AggregatesSectionWrapper = styled.div`
  display: flex;
  gap: 5rem;
`;

const PopularitySection = styled.div`
  display: flex;
  gap: 5rem;
`;

const PopularityTable = ({ label, data }: { label: string; data: Array<BikeStationPopularity> }) => {
  return (
    <PopularityTableWrapper>
      <h3>{label}</h3>
      <table>
        <tbody>
          {data.map((row) => (
            <tr key={row.bike_station_id}>
              <td>
                <Link to={`/bike-stations/${row.bike_station_id}`}>{row.bike_station_name}</Link>
              </td>
              <td>{row.journey_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PopularityTableWrapper>
  );
};

const PopularityTableWrapper = styled.div`
  flex: 1;

  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 1.2rem;
  }

  tr {
    height: 2rem;
    border-bottom: 1px solid gray;
  }

  td:last-child {
    text-align: right;
  }
`;
