import styled from 'styled-components';

export const Table = styled.table`
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
