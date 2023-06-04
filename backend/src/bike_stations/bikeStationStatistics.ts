import { BikeStationAggregates, BikeStationPopularity } from '../types';

export const bikeStationStatisticsQuery = `
  select 
  s.id as "bike_station_id",
    sum(case when j.departure_station_id = s.id then 1 else 0 end) as "journeys_starting_from_station",
    sum(case when j.return_station_id = s.id then 1 else 0 end) as "journeys_returning_to_station",
    avg(case when j.departure_station_id = s.id then j.covered_distance_in_meters end) as "departuring_journeys_avg_distance_in_meters",
    avg(case when j.return_station_id = s.id then j.covered_distance_in_meters end) as "returning_journeys_avg_distance_in_meters"
  from journeys j
  join bike_stations s on j.departure_station_id = s.id or j.return_station_id = s.id
  where 
    s.id = $1
  group by s.id
`;

export const popularDeparturesTo = `
  select 
    j.return_station_id as "bike_station_id",
    j.return_station_name as "bike_station_name", 
    count(j.return_station_id) as "journey_count"
  from journeys j 
  where j.departure_station_id = $1
  group by 
    j.return_station_name,
    j.return_station_id
  order by "journey_count" desc
  limit $2
`;

export const popularReturnsFrom = `
  select 
    j.departure_station_id as "bike_station_id",
    j.departure_station_name as "bike_station_name", 
    count(j.departure_station_id) as "journey_count"
  from journeys j 
  where j.return_station_id = $1
  group by 
    j.departure_station_name,
    j.departure_station_id
  order by "journey_count" desc
  limit $2
`;

export const isBikeStationAggregates = (obj: unknown): obj is BikeStationAggregates => {
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

export const isBikeStationPopularityStatistic = (obj: unknown): obj is BikeStationPopularity => {
  if (!obj || typeof obj !== 'object') return false;
  const requiredProperties = ['bike_station_id', 'bike_station_name', 'journey_count'];
  return requiredProperties.every((property) => property in obj);
};
