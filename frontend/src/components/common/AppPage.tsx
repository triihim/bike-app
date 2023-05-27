import styled from 'styled-components';
import { Navbar } from './Navbar';
import { Spacer, SpacerDirection } from './Spacer';

export const AppPage = ({ children }: { children: React.ReactNode }) => (
  <StyledAppLayout>
    <Navbar />
    <Spacer direction={SpacerDirection.Vertical} size={1} />
    {children}
  </StyledAppLayout>
);

const StyledAppLayout = styled.div`
  max-width: 80rem;
  min-height: 100vh;
  margin: 2rem auto;
  padding: 3rem;
  background: ${(props) => props.theme.colors.surface};
  -webkit-box-shadow: 0px 5px 16px -8px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 5px 16px -8px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 5px 16px -8px rgba(0, 0, 0, 0.75);
`;
