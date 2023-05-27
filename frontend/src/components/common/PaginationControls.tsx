import styled from 'styled-components';
import { PrimaryButton } from './PrimaryButton';

interface PaginationControlsProps {
  onNext(): void;
  onPrevious(): void;
  nextDisabled: boolean;
  previousDisabled: boolean;
  currentPageIndex: number;
  totalPages: number;
}

export const PaginationControls = (props: PaginationControlsProps) => {
  return (
    <PaginationControlsWrapper>
      <PrimaryButton disabled={props.previousDisabled} onClick={props.onPrevious}>
        Previous page
      </PrimaryButton>
      <PaginationInfoWrapper>
        Page {props.currentPageIndex} of {props.totalPages}
      </PaginationInfoWrapper>
      <PrimaryButton disabled={props.nextDisabled} onClick={props.onNext}>
        Next page
      </PrimaryButton>
    </PaginationControlsWrapper>
  );
};

const PaginationControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  & > button {
    width: 10rem;
  }
`;

const PaginationInfoWrapper = styled.div`
  padding: 0 1rem;
  font-size: 0.9rem;
`;
