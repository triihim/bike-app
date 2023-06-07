import styled from 'styled-components';

export const SecondaryButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.primary};
  border: 2px solid ${(props) => props.theme.colors.primary};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.textLight};
  }

  &:disabled {
    opacity: 0.5;
  }
`;
