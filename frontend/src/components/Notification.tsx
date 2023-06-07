import { PropsWithChildren, createContext, useState } from 'react';
import styled from 'styled-components';
import { FaRegWindowClose } from 'react-icons/fa';

export enum NotificationType {
  Success,
  Error,
  Info,
}

interface NotificationContextProps {
  showNotification(message: string, type: NotificationType): void;
  hideNotification(): void;
}

export const NotificationContext = createContext<NotificationContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showNotification: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  hideNotification: () => {},
});

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);

  const showNotification = (message: string, type: NotificationType) => setNotification({ message, type });
  const hideNotification = () => setNotification(null);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={hideNotification} />
      )}
      {children}
    </NotificationContext.Provider>
  );
};

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

const Notification = (props: NotificationProps) => {
  return (
    <NotificationWrapper notificationType={props.type}>
      <span>{props.message}</span>
      <FaRegWindowClose onClick={props.onClose} size={25} />
    </NotificationWrapper>
  );
};

const NotificationWrapper = styled.div<{ notificationType: NotificationType }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${(props) => {
    switch (props.notificationType) {
      case NotificationType.Error:
        return props.theme.colors.errorBackground;
      case NotificationType.Success:
        return props.theme.colors.successBackground;
      default:
        return props.theme.colors.infoBackground;
    }
  }};
  & * {
    color: ${(props) => {
      switch (props.notificationType) {
        case NotificationType.Error:
          return props.theme.colors.errorText;
        case NotificationType.Success:
          return props.theme.colors.successText;
        default:
          return props.theme.colors.infoText;
      }
    }};
  }
  font-size: 1.2rem;
  -webkit-box-shadow: 0px 3px 10px -8px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 3px 10px -8px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 3px 10px -8px rgba(0, 0, 0, 0.75);

  & svg {
    cursor: pointer;
  }
`;
