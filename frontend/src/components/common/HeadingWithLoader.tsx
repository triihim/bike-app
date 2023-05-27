import styled from 'styled-components';
import { Loader } from './Loader';

interface HeadingWithLoaderProps {
  label: string;
  loading?: boolean;
}

export const HeadingWithLoader = ({ label, loading }: HeadingWithLoaderProps) => {
  return (
    <HeadingWithLoaderWrapper>
      <h1>{label}</h1>
      {loading && <Loader />}
    </HeadingWithLoaderWrapper>
  );
};

const HeadingWithLoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
