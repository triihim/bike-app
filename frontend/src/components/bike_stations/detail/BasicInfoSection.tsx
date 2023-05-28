import { BikeStation } from '../types';

export const BasicInfoSection = ({ bikeStation }: { bikeStation: BikeStation }) => {
  return (
    <>
      <h1>{bikeStation.name}</h1>
      <p>
        {bikeStation.address}, {bikeStation.city}
      </p>
    </>
  );
};
