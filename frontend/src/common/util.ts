export const metersToKilometers = (meters: number) => (meters / 1000).toFixed(2);
export const secondsToMinutes = (seconds: number) => (seconds / 60).toFixed(2);
export const assignFirstObjectProperty = <T>(obj: { [key: string]: T }, property: string, value: T) => {
  const copyOfOld = { ...obj };
  delete copyOfOld[property];
  return { [property]: value, ...copyOfOld };
};
