import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

interface ModalContextProps {
  setModalContent(content: React.ReactNode | null): void;
}

export const ModalContext = createContext<ModalContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setModalContent: () => {},
});

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  return (
    <ModalContext.Provider value={{ setModalContent }}>
      {modalContent && <ModalPortal onModalClose={() => setModalContent(null)}>{modalContent}</ModalPortal>}
      {children}
    </ModalContext.Provider>
  );
};

interface ModalWrapperProps {
  onModalClose(): void;
  children: React.ReactNode;
}

const ModalPortal = (props: ModalWrapperProps) => {
  const preventOverlayClickDetectionOnModalClick = (e: React.MouseEvent) => e.stopPropagation();
  return ReactDOM.createPortal(
    <Overlay onClick={props.onModalClose}>
      <ModalWrapper onClick={preventOverlayClickDetectionOnModalClick}>{props.children}</ModalWrapper>
    </Overlay>,
    document.body,
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 100;
`;

const ModalWrapper = styled.div`
  margin: auto;
  margin-top: 10vh;
  width: 50vw;
  z-index: 200;
`;

interface ModalProps {
  heading: string;
  content: React.ReactNode;
  footer: React.ReactNode;
}

export const Modal = (props: ModalProps) => {
  return (
    <StyledModal>
      <h1 className="heading">{props.heading}</h1>
      <div className="content">{props.content}</div>
      <footer className="footer">{props.footer}</footer>
    </StyledModal>
  );
};

const StyledModal = styled.div`
  background: ${(props) => props.theme.colors.surface};
  display: flex;
  flex-direction: column;

  & .heading {
    margin: 0;
    padding: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  }

  & .content {
    flex: 5;
    overflow-y: scroll;
    margin: 0;
    padding: 0;
  }

  & .footer {
    border-top: 1px solid ${(props) => props.theme.colors.divider};
    margin: 0;
    padding: 0;
  }
`;
