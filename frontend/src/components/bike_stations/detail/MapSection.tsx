import styled from 'styled-components';

interface MapSectionProps {
  longitude: number;
  latitude: number;
}

const MAPS_API_KEY = 'AIzaSyCNGEg-0X4cKy9LJQ4UIzUnadv6Gv2HS7Q';

export const MapSection = (props: MapSectionProps) => {
  return (
    <MapSectionWrapper>
      <iframe
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${props.latitude},${props.longitude}`}
      ></iframe>
    </MapSectionWrapper>
  );
};

const MapSectionWrapper = styled.div`
  iframe {
    border: 0;
    width: 100%;
    height: 500px;
  }
`;
