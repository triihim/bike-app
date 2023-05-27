import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const Navbar = () => {
  return (
    <NavbarWrapper>
      <NavLink to={'/journeys'}>Journeys</NavLink>
      <NavLink to={'/bike-stations'}>Bike Stations</NavLink>
    </NavbarWrapper>
  );
};

const NavbarWrapper = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid ${(props) => props.theme.colors.primary};

  & > a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.textDark};
    padding: 0.5rem 1rem;
  }

  & > a.active {
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.textLight};
  }
`;
