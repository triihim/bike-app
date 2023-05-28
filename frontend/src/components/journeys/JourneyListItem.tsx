import { Journey } from './types';
import { ListItem, ListItemCell } from '../common/ListItem';
import { metersToKilometers, secondsToMinutes } from '../../common/util';

interface JourneyListItemProps {
  journey: Journey;
}

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
