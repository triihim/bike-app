import styled from 'styled-components';

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
`;

interface ListItemCellProps {
  label: string;
  value: string | number;
}

export const ListItemCell = ({ label, value }: ListItemCellProps) => {
  return (
    <ListItemCellWrapper>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
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
`;
