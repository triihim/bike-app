import styled, { css } from 'styled-components';

export enum SpacerDirection {
  Horizontal,
  Vertical,
}

interface SpacerProps {
  size: number;
  direction: SpacerDirection;
}

export const Spacer = styled.div<SpacerProps>`
  ${(props) => css`
    ${props.direction === SpacerDirection.Horizontal ? `width: ${props.size}em;` : `height: ${props.size}em;`}
  `}
`;
