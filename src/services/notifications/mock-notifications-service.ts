import type {
  NexusNotification,
  NotificationsService,
} from "@/services/notifications/notifications-service";

const initialNotifications: NexusNotification[] = [
  {
    id: "notification-1",
    title: "Payment due tomorrow",
    body: "Your credit-card statement is due July 14.",
    kind: "warning",
    read: false,
    createdAt: "2026-07-12T08:00:00+05:30",
  },
  {
    id: "notification-2",
    title: "Interview confirmed",
    body: "Amazon recruiter screen is set for July 15 at 11:00 AM.",
    kind: "update",
    read: false,
    createdAt: "2026-07-11T16:40:00+05:30",
  },
];

export class MockNotificationsService implements NotificationsService {
  private notifications = structuredClone(initialNotifications);

  async getNotifications() {
    return structuredClone(this.notifications);
  }

  async markRead(notificationId: string) {
    const notification = this.notifications.find(
      (item) => item.id === notificationId,
    );
    if (!notification)
      throw new Error(`Notification ${notificationId} was not found.`);
    notification.read = true;
    return structuredClone(notification);
  }

  async markAllRead() {
    this.notifications.forEach((notification) => {
      notification.read = true;
    });
  }
}

export const notificationsService: NotificationsService =
  new MockNotificationsService();
