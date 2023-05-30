export interface CSVBikeStation {
  FID: string;
  ID: string;
  Nimi: string;
  Namn: string;
  Name: string;
  Osoite: string;
  Adress: string;
  Kaupunki: string;
  Stad: string;
  Operaattor: string;
  Kapasiteet: string;
  x: string;
  y: string;
}

export interface CSVJourney {
  Departure: string;
  Return: string;
  'Departure station id': string;
  'Departure station name': string;
  'Return station id': string;
  'Return station name': string;
  'Covered distance (m)': string;
  'Duration (sec.)': string;
}

export type MapFunction<T, U> = (a: T) => U | null;

export type CSVBufferProcessor<T> = (buffer: Array<T>) => Promise<void>;

export interface CSVParseFunctionParameters<T> {
  bufferSize: number;
  bufferProcessor: CSVBufferProcessor<T>;
}

export interface PageRequest extends Express.Request {
  query: {
    start: number;
    limit: number;
    sortColumn?: string;
    sortDirection?: 'ASC' | 'DESC';
  };
}

export interface NumberIdRequest extends Express.Request {
  params: {
    id: number;
  };
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
