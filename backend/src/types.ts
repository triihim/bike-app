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
  };
}
