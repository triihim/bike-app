export function isCorrectlySorted<T>(data: Array<T>, columnName: keyof T, direction: 'ASC' | 'DESC') {
  const columnValues = data.map((entry) => entry[columnName]);

  if (direction === 'ASC') {
    return columnValues.every((value, index) => index === columnValues.length - 1 || value <= columnValues[index + 1]);
  }

  if (direction === 'DESC') {
    return columnValues.every((value, index) => index === 0 || value <= columnValues[index - 1]);
  }
}
