export type NotificationKind = "reminder" | "warning" | "update";

export interface NexusNotification {
  id: string;
  title: string;
  body: string;
  kind: NotificationKind;
  read: boolean;
  createdAt: string;
}

export interface NotificationsService {
  getNotifications(): Promise<NexusNotification[]>;
  markRead(notificationId: string): Promise<NexusNotification>;
  markAllRead(): Promise<void>;
}
