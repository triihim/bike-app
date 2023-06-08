import styled from 'styled-components';
import { CenteredLoader } from './Loader';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface FormSubmitControlsProps {
  loading: boolean;
  disableSubmit: boolean;
  onCancel(): void;
  onSubmit(): void;
}

export const FormSubmitControls = (props: FormSubmitControlsProps) => {
  return (
    <FormSubmitControlsWrapper>
      <SecondaryButton onClick={props.onCancel}>Cancel</SecondaryButton>
      {props.loading && <CenteredLoader />}
      <PrimaryButton disabled={props.disableSubmit} onClick={props.onSubmit}>
        Submit
      </PrimaryButton>
    </FormSubmitControlsWrapper>
  );
};

const FormSubmitControlsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;
