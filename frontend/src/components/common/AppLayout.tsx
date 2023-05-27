import styled from 'styled-components';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = (props: AppLayoutProps) => {
  return <StyledAppLayout>{props.children}</StyledAppLayout>;
};

const StyledAppLayout = styled.div`
  max-width: 80rem;
  min-height: 100vh;
  margin: 2rem auto;
  padding: 3rem;
  background: ${(props) => props.theme.colors.surface};
`;
