import { BikeStationStatistics } from '../types';

export const bikeStationStatisticsQuery = `
  select 
  s.id as "bike_station_id",
    sum(case when j.departure_station_id = s.id then 1 end) as "journeys_starting_from_station",
    sum(case when j.return_station_id = s.id then 1 end) as "journeys_returning_to_station",
    avg(case when j.departure_station_id = s.id then j.covered_distance_in_meters end) as "departuring_journeys_avg_distance_in_meters",
    avg(case when j.return_station_id = s.id then j.covered_distance_in_meters end) as "returning_journeys_avg_distance_in_meters"
  from journeys j
  join bike_stations s on j.departure_station_id = s.id or j.return_station_id = s.id
  where 
    s.id = $1
  group by s.id
`;

export const isBikeStationStatistics = (obj: unknown): obj is BikeStationStatistics => {
  if (!obj || typeof obj !== 'object') return false;
  const requiredProperties = [
    'bike_station_id',
    'journeys_starting_from_station',
    'journeys_returning_to_station',
    'departuring_journeys_avg_distance_in_meters',
    'returning_journeys_avg_distance_in_meters',
  ];
  return requiredProperties.every((property) => property in obj);
};
