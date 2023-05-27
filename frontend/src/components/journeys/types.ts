export interface Journey {
  id: number;
  departure: Date;
  return: Date;
  departureStationId: number;
  departureStationName: string;
  returnStationId: number;
  returnStationName: string;
  returnStation: string;
  coveredDistanceInMeters: number;
  durationInSeconds: number;
}
