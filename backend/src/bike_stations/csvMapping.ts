import { tryParseInt, tryParseNonEmptyString, tryParseFloat } from '../util';
import { MapFunction, CSVBikeStation } from '../types';
import { BikeStation } from './BikeStation.entity';

export const BIKE_STATION_COLUMN_HEADERS = [
  'FID',
  'ID',
  'Nimi',
  'Namn',
  'Name',
  'Osoite',
  'Adress',
  'Kaupunki',
  'Stad',
  'Operaattor',
  'Kapasiteet',
  'x',
  'y',
];

export const bikeStationMapFn: MapFunction<CSVBikeStation, BikeStation> = (row) => {
  try {
    return {
      id: tryParseInt(row.ID),
      address: tryParseNonEmptyString(row.Osoite),
      city: row.Kaupunki.trim().length > 0 ? row.Kaupunki : 'Helsinki',
      name: tryParseNonEmptyString(row.Name),
      capacity: tryParseInt(row.Kapasiteet),
      operator: row.Operaattor,
      x: tryParseFloat(row.x),
      y: tryParseFloat(row.y),
    };
  } catch (error) {
    return null;
  }
};
