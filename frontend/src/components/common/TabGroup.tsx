import { useState } from 'react';
import styled from 'styled-components';

interface TabGroupProps {
  tabs: Array<{
    label: string;
    component: React.ReactNode;
  }>;
}

export const TabGroup = (props: TabGroupProps) => {
  const [selected, setSelected] = useState(0);
  return (
    <div>
      <TabGroupHeader>
        {props.tabs.map((tab, index) => (
          <TabLabel onClick={() => setSelected(index)} isSelected={selected === index}>
            {tab.label}
          </TabLabel>
        ))}
      </TabGroupHeader>
      {props.tabs[selected].component}
    </div>
  );
};

const TabGroupHeader = styled.div`
  display: flex;
  gap: 1.5rem;
  border-bottom: 2px solid ${(props) => props.theme.colors.primary};
`;

const TabLabel = styled.span<{ isSelected: boolean }>`
  cursor: pointer;
  background: ${(props) => (props.isSelected ? props.theme.colors.primary : 'transparent')};
  color: ${(props) => (props.isSelected ? props.theme.colors.textLight : props.theme.colors.textDark)};
  padding: 0.5rem 1rem;
`;
