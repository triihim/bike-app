import styled from 'styled-components';
import { FilterBy, OrderBy } from '../../common/types';
import { OrderingButton } from './OrderingButton';
import { DebouncedInput } from './DebouncedInput';

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
  rows?: Array<T>;
  orderBy: OrderBy<T>;
  orderByColumn: (orderBy: OrderBy<T>) => void;
  filterByValue: (filterBy: FilterBy<T>) => void;
}

export interface ColumnHeaderProps<T> {
  label: string;
  property: keyof T;
  orderable?: { currentOrdering: OrderBy<T>; orderByColumn: (orderBy: OrderBy<T>) => void };
  filterByValue?: (filterBy: FilterBy<T>) => void;
}

export const ColumnHeader = <T,>({ label, property, orderable, filterByValue }: ColumnHeaderProps<T>) => {
  if (orderable) {
    const { currentOrdering } = orderable;
    const columnOrdering = currentOrdering.property === property ? currentOrdering.direction : undefined;
    return (
      <StyledColumnHeader>
        <div>
          <span>{label}</span>
          <OrderingButton
            direction={columnOrdering}
            onClick={() =>
              orderable.orderByColumn({ property, direction: currentOrdering.direction === 'ASC' ? 'DESC' : 'ASC' })
            }
          />
        </div>
        {filterByValue && (
          <div className="filter">
            <DebouncedInput onChange={(value) => filterByValue({ property, value })} />
          </div>
        )}
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
  vertical-align: top;

  & div:nth-child(2) {
    position: relative;
    top: 5px;
  }

  & .filter {
    margin: 0.25rem 0;
  }

  & .filter input {
    padding: 0.25rem;
  }
`;
