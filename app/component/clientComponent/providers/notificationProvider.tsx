"use client";

import { NotificationContextType, NotificationType } from "@/type/notifType";
import { createContext, useContext, useState } from "react";

export const NotificationContext = createContext<NotificationContextType>({
  notification: {
    message: "",
    type: null,
  },
  setNotification: () => {},
});

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useState<NotificationType>({
    message: "",
    type: null,
  });

  const contextValue: NotificationContextType = {
    notification,
    setNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {notification.message && (
        <div
          className={`absolute top-0 bg-${notification.type}-300 text-white z-40`}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
