import { CSVParseFunctionParameters, MapFunction } from '../types';
import fs from 'fs';
import csv from 'csv-parser';

class CsvParser<TRow, TMapped> {
  constructor(
    // Path to CSV-file containing rows of type TRow.
    private _csvPath: string,

    // Column headers that must match the property names of TRow, but not necessarily the actual CSV-headers
    private _columnHeaders: Array<string>,

    // Function that maps TRow to TMapped. Returning null from the function leads to skipping the row.
    private _rowMappingFunction: MapFunction<TRow, TMapped>,
  ) {}

  parse({ bufferSize, bufferProcessor }: CSVParseFunctionParameters<TMapped>): Promise<void> {
    return new Promise((resolve, reject) => {
      let buffer: Array<TMapped> = [];
      const runningProcessors: Array<Promise<void>> = [];

      const processRow = (row: TRow) => {
        const mapped = this._rowMappingFunction(row);
        if (mapped !== null) {
          buffer.push(mapped);
        }
      };

      const maybeFlushBuffer = () => {
        if (buffer.length >= bufferSize) {
          runningProcessors.push(bufferProcessor([...buffer]));
          buffer = [];
        }
      };

      fs.createReadStream(this._csvPath)
        .pipe(csv({ headers: this._columnHeaders }))
        .on('data', (row: TRow) => {
          processRow(row);
          maybeFlushBuffer();
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          runningProcessors.push(bufferProcessor([...buffer])); // Remaining buffer that did not necessarily reach bufferSize.
          Promise.all(runningProcessors).then(() => resolve());
        });
    });
  }
}

export default CsvParser;
