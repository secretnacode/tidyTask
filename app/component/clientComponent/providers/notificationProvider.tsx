"use client";

import { NotificationContextType, NotificationType } from "@/type/notifType";
import { createContext, useCallback, useContext, useState } from "react";
import { NotificationDisplay } from "../../notification";

// make a context provider so the value that its passing can
// accessible to the children under it, in this case the notification object
// and setNotification, this value inside will be used as a fallback
// the fall back will happen if you usee this context outside of the provider
export const NotificationContext = createContext<NotificationContextType>({
  notification: { message: "", type: null },
  showNotification: () => {},
});

// make a provider component that is using the context at the top as a component
// and passing a context value tp that component which is the notification and setNotification
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useState<NotificationType>({
    message: "",
    type: null,
  });

  const showNotification = useCallback(
    ({ message, type }: NotificationType) => {
      setNotification({ message, type });
      setTimeout(() => {
        setNotification({ message: "", type: null });
      }, 6000);
    },
    []
  );

  const contextValue: NotificationContextType = {
    notification,
    showNotification,
  };

  // will return the context provider with the value of the notification and setNotification
  return (
    <NotificationContext.Provider value={contextValue}>
      <NotificationDisplay />
      {children}
    </NotificationContext.Provider>
  );
}

// making a custom hook that is using the context at the top
export const useNotification = () => useContext(NotificationContext);
