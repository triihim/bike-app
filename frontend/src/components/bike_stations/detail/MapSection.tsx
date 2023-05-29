import styled from 'styled-components';

interface MapSectionProps {
  longitude: number;
  latitude: number;
}

export const MapSection = (props: MapSectionProps) => {
  return (
    <MapSectionWrapper>
      <iframe
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${props.latitude},${props.longitude}`}
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
