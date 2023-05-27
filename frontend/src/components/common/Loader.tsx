import { PulseLoader } from 'react-spinners';
import styled, { useTheme } from 'styled-components';

export const CenteredLoader = () => {
  const theme = useTheme();
  return (
    <CenteredLoaderWrapper>
      <PulseLoader color={theme.colors.primaryVariant} />
    </CenteredLoaderWrapper>
  );
};

export const Loader = () => {
  const theme = useTheme();
  return <PulseLoader color={theme.colors.primaryVariant} size={10} />;
};

const CenteredLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
