import styled from 'styled-components';

interface OrderingButtonProps {
  direction: 'ASC' | 'DESC';
  onClick(): void;
}

const OrderingButtonWrapper = styled.div`
  display: inline;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 0.2rem;
`;

export const OrderingButton = ({ direction, onClick }: OrderingButtonProps) => {
  return (
    <OrderingButtonWrapper onClick={onClick}>
      {direction === 'ASC' ? <span>&uarr;</span> : <span>&darr;</span>}
    </OrderingButtonWrapper>
  );
};
