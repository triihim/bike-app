import { Journey } from './types';
import { ListItem, ListItemCell } from '../common/ListItem';

interface JourneyListItemProps {
  journey: Journey;
}

const metersToKilometers = (meters: number) => (meters / 1000).toFixed(2);
const secondsToMinutes = (seconds: number) => (seconds / 60).toFixed(2);

export const JourneyListItem = ({ journey }: JourneyListItemProps) => {
  return (
    <ListItem>
      <ListItemCell label="Departure station" value={journey.departureStationName} />
      <ListItemCell label="Return station" value={journey.returnStationName} />
      <ListItemCell label="Distance (km)" value={metersToKilometers(journey.coveredDistanceInMeters)} />
      <ListItemCell label="Duration (min)" value={secondsToMinutes(journey.durationInSeconds)} />
    </ListItem>
  );
};
