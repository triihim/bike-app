export interface BikeStation {
  id: number;
  name: string;
  address: string;
  city: string;
  operator: string;
  capacity: number;
  x: number;
  y: number;
}

export interface BikeStationPopularity {
  bike_station_id: number;
  bike_station_name: string;
  journey_count: number;
}

export interface BikeStationAggregates {
  bike_station_id: number;
  journeys_starting_from_station: number;
  journeys_returning_to_station: number;
  departuring_journeys_avg_distance_in_meters: number;
  returning_journeys_avg_distance_in_meters: number;
}

export interface BikeStationStatistics {
  aggregates: BikeStationAggregates;
  topReturnsFrom: Array<BikeStationPopularity>;
  topDeparturesTo: Array<BikeStationPopularity>;
}
