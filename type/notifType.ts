export type NotificationType = {
  message: string;
  type: "success" | "error" | "warning" | null;
};

export interface NotificationContextType {
  notification: NotificationType;
  setNotification: React.Dispatch<React.SetStateAction<NotificationType>>;
}
