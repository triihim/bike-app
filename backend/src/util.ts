import path from 'path';
import { ParsingError } from './errors';
import fs from 'fs';
import { ILike } from 'typeorm';

const getErrorMessage = (typename: string, value?: unknown, extraInfo?: string) => {
  let message = `Could not parse ${typename} from ${value}`;
  if (extraInfo) {
    message += ` :: ${extraInfo}`;
  }
  return message;
};

export const tryParseInt = (value?: string, extraInfo?: string): number => {
  const errorMessage = getErrorMessage('int', value, extraInfo);

  if (value === undefined) throw new ParsingError(errorMessage);

  const parsedInt = parseInt(value);

  if (isNaN(parsedInt)) {
    throw new ParsingError(errorMessage);
  } else {
    return parsedInt;
  }
};

export const tryParseFloat = (value?: string, extraInfo?: string): number => {
  const errorMessage = getErrorMessage('float', value, extraInfo);

  if (value === undefined) throw new ParsingError(errorMessage);

  const parsedFloat = parseFloat(value);

  if (isNaN(parsedFloat)) {
    throw new ParsingError(errorMessage);
  } else {
    return parsedFloat;
  }
};

export const tryParseNonEmptyString = (value?: string, extraInfo?: string): string => {
  const errorMessage = getErrorMessage('non-empty string', value, extraInfo);

  if (value === undefined || value.trim().length === 0) {
    throw new ParsingError(errorMessage);
  } else {
    return value;
  }
};

export const tryParseDate = (value?: string, extraInfo?: string): Date => {
  const errorMessage = getErrorMessage('date', value, extraInfo);

  if (value === undefined) throw new ParsingError(errorMessage);

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    throw new ParsingError(errorMessage);
  } else {
    return date;
  }
};

export const tryParseBool = (value?: string, extraInfo?: string): boolean => {
  const errorMessage = getErrorMessage('bool', value, extraInfo);

  if (value === undefined) throw new ParsingError(errorMessage);

  const maybeBool = value.toLowerCase();

  if (maybeBool === 'true') return true;
  if (maybeBool === 'false') return false;

  throw new ParsingError(errorMessage);
};

export const getAbsoluteCsvFilepaths = (pathToCsvFolder: string): Promise<Array<string>> => {
  return new Promise((resolve, reject) => {
    fs.readdir(pathToCsvFolder, (error, filenames) => {
      if (error) return reject(error);
      const csvFiles = filenames.filter((filename) => filename.toLowerCase().endsWith('.csv'));
      const absoluteCsvFilepaths = csvFiles.map((csvFilename) => path.join(pathToCsvFolder, csvFilename));
      resolve(absoluteCsvFilepaths);
    });
  });
};

export const getOrderBy = (validColumnNames: Array<string>, sortColumn?: string, sortDirection?: string) => {
  if (sortColumn && sortDirection) {
    if (validColumnNames.includes(sortColumn)) {
      const direction = sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      return { [sortColumn]: direction };
    }
  }
  return undefined;
};

export const getWhereBeginsLike = (
  validColumnNames: Array<string>,
  filterColumn?: string | Array<string>,
  filterValue?: string | Array<string>,
) => {
  const filterColumns = typeof filterColumn === 'string' ? [filterColumn] : filterColumn;
  const filterValues = typeof filterValue === 'string' ? [filterValue] : filterValue;

  const beginsLike = (value: string) => ILike(`${value}%`);

  const addWhereLikeCondition = (where: object, column: string, index: number) => {
    if (validColumnNames.includes(column) && filterValues) {
      return { ...where, [column]: beginsLike(filterValues[index]) };
    }
    return where;
  };

  if (filterColumns && filterValues && filterColumns.length === filterValues.length) {
    return filterColumns.reduce(addWhereLikeCondition, new Object());
  }

  return undefined;
};
