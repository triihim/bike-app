import styled from 'styled-components';

export const PrimaryButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.textLight};
  border: none;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryVariant};
  }

  &:disabled {
    opacity: 0.5;
  }
`;
