import styled from 'styled-components';
import { OrderBy } from '../../common/types';
import { OrderingButton } from './OrderingButton';

export const StyledTable = styled.table`
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  text-align: left;

  tr {
    border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  }

  td,
  th {
    padding: 0.75rem 0;
  }
`;

export interface TableProps<T> {
  rows: Array<T>;
  orderBy: OrderBy<T>;
  orderByColumn: (orderBy: OrderBy<T>) => void;
}

export interface ColumnHeaderProps<T> {
  label: string;
  orderable?: { property: keyof T; currentOrdering: OrderBy<T>; orderByColumn: (orderBy: OrderBy<T>) => void };
}

export const ColumnHeader = <T,>({ label, orderable }: ColumnHeaderProps<T>) => {
  if (orderable) {
    const { property, currentOrdering } = orderable;
    const columnOrdering = currentOrdering.property === property ? currentOrdering.direction : undefined;
    return (
      <StyledColumnHeader>
        <span>{label}</span>
        <OrderingButton
          direction={columnOrdering}
          onClick={() =>
            orderable.orderByColumn({ property, direction: currentOrdering.direction === 'ASC' ? 'DESC' : 'ASC' })
          }
        />
      </StyledColumnHeader>
    );
  } else {
    return (
      <StyledColumnHeader>
        <span>{label}</span>
      </StyledColumnHeader>
    );
  }
};

const StyledColumnHeader = styled.th`
  & div:nth-child(2) {
    position: relative;
    top: 5px;
  }
`;
