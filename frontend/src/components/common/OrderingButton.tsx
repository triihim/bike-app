import styled from 'styled-components';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

interface OrderingButtonProps {
  direction?: 'ASC' | 'DESC';
  onClick(): void;
}

const OrderingButtonWrapper = styled.div`
  display: inline;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 0.2rem;
`;

export const OrderingButton = ({ direction, onClick }: OrderingButtonProps) => {
  let symbol = <FaSort />;

  if (direction === 'ASC') {
    symbol = <FaSortUp />;
  } else if (direction === 'DESC') {
    symbol = <FaSortDown />;
  }

  return <OrderingButtonWrapper onClick={onClick}>{symbol}</OrderingButtonWrapper>;
};
