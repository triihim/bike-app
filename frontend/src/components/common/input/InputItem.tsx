import styled from 'styled-components';

export enum InputSize {
  S,
  M,
  L,
  XL,
}

export const InputItem = styled.div<{ size: InputSize }>`
  grid-column: span ${(props) => resolveInputSize(props.size)};

  & label {
    line-height: 1.5rem;
    font-weight: bold;
  }

  & input,
  select {
    width: 100%;
    box-sizing: border-box;
    padding: 0.5rem;
    font-size: 1rem;
  }
`;

const resolveInputSize = (size: InputSize) => {
  switch (size) {
    case InputSize.XL:
      return 4;
    case InputSize.L:
      return 3;
    case InputSize.M:
      return 2;
    case InputSize.S:
    default:
      return 1;
  }
};
