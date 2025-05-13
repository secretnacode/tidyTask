export type NotificationType = {
  message: string;
  type: "success" | "error" | "warning" | null;
};

export interface NotificationContextType {
  notification: NotificationType;
  showNotification: ({ message, type }: NotificationType) => void;
}
