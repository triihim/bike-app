import { MapFunction, CSVJourney } from '../types';
import { tryParseDate, tryParseInt, tryParseNonEmptyString } from '../util';
import { Journey } from './Journey.entity';

export const JOURNEY_COLUMN_HEADERS = [
  'Departure',
  'Return',
  'Departure station id',
  'Departure station name',
  'Return station id',
  'Return station name',
  'Covered distance (m)',
  'Duration (sec.)',
];

const journeyInclusionCriteria = {
  minimumDurationSeconds: 10,
  minimumDistanceMeters: 10,
};

export const journeyMapFn: MapFunction<CSVJourney, Omit<Journey, 'id'>> = (row) => {
  try {
    const journey = {
      departure: tryParseDate(row.Departure),
      departureStationId: tryParseInt(row['Departure station id']),
      departureStationName: tryParseNonEmptyString(row['Departure station name']),
      return: tryParseDate(row.Return),
      returnStationId: tryParseInt(row['Return station id']),
      returnStationName: tryParseNonEmptyString(row['Return station name']),
      coveredDistanceInMeters: tryParseInt(row['Covered distance (m)']),
      durationInSeconds: tryParseInt(row['Duration (sec.)']),
    };

    if (
      journey.durationInSeconds >= journeyInclusionCriteria.minimumDurationSeconds &&
      journey.coveredDistanceInMeters >= journeyInclusionCriteria.minimumDistanceMeters
    ) {
      return journey;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
