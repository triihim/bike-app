import styled from 'styled-components';
import { Journey } from './types';

interface JourneyListItemProps {
  journey: Journey;
}

const metersToKilometers = (meters: number) => (meters / 1000).toFixed(2);
const secondsToMinutes = (seconds: number) => (seconds / 60).toFixed(2);

export const JourneyListItem = ({ journey }: JourneyListItemProps) => {
  return (
    <StyledListItem>
      <PropertyCell label="Departure station" value={journey.departureStationName} />
      <PropertyCell label="Return station" value={journey.returnStationName} />
      <PropertyCell label="Distance (km)" value={metersToKilometers(journey.coveredDistanceInMeters)} />
      <PropertyCell label="Duration (min)" value={secondsToMinutes(journey.durationInSeconds)} />
    </StyledListItem>
  );
};

interface PropertyCellProps {
  label: string;
  value: string | number;
}

const PropertyCell = ({ label, value }: PropertyCellProps) => {
  return (
    <PropertyCellWrapper>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </PropertyCellWrapper>
  );
};

const PropertyCellWrapper = styled.div`
  display: flex;
  flex-direction: column;

  & .label {
    font-size: 0.75rem;
    margin-bottom: 0.2rem;
  }

  & .value {
    font-weight: bold;
    font-size: 0.9rem;
  }
`;

const StyledListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  list-style-type: none;
  margin: 0.75rem 0;
  padding: 1rem;
  background: ${(props) => props.theme.colors.surface};
  -webkit-box-shadow: 0px 1px 5px -3px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 5px -3px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 1px 5px -3px rgba(0, 0, 0, 0.75);
`;
