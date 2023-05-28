export interface Journey {
  id: number;
  departure: Date;
  return: Date;
  departureStationId: number;
  departureStationName: string;
  returnStationId: number;
  returnStationName: string;
  coveredDistanceInMeters: number;
  durationInSeconds: number;
}
