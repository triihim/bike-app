import styled, { css } from 'styled-components';

export const ListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  list-style-type: none;
  margin: 0.75rem 0;
  padding: 1rem;
  background: ${(props) => props.theme.colors.surface};
  -webkit-box-shadow: 0px 1px 5px -3px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 5px -3px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 1px 5px -3px rgba(0, 0, 0, 0.75);

  ${(props) =>
    props.onClick &&
    css`
      cursor: pointer;
      :hover {
        background: ${props.theme.colors.primary};
        color: ${props.theme.colors.textLight};
      }
    `}
`;

interface ListItemCellProps {
  label: string;
  value: string | number;
  onClick?(): void;
}

export const ListItemCell = ({ label, value, onClick }: ListItemCellProps) => {
  const valueText = value.toString().trim();
  const valueAvailable = valueText.length > 0;
  return (
    <ListItemCellWrapper onClick={onClick}>
      <span className="label">{label}</span>
      <span className="value">{valueAvailable ? valueText : 'Not available'}</span>
    </ListItemCellWrapper>
  );
};

const ListItemCellWrapper = styled.div`
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

  ${(props) =>
    props.onClick &&
    css`
      cursor: pointer;
      :hover {
        background: ${props.theme.colors.primary};
        color: ${props.theme.colors.textLight};
      }
    `}
`;