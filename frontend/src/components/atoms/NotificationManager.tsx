import { NotificationManager as Notification } from "react-notifications";

class NotificationManager {
  public static info = (
    message: string,
    title?: string,
    timeout = 5000,
    callback?: () => any,
  ) => {
    Notification.info(message, title, timeout, callback);
  };

  public static success = (
    message: string,
    title?: string,
    timeout = 5000,
    callback?: () => any,
  ) => {
    Notification.success(message, title, timeout, callback);
  };

  public static warning = (
    message: string,
    title?: string,
    timeout = 5000,
    callback?: () => any,
  ) => {
    Notification.warning(message, title, timeout, callback);
  };

  public static error = (
    message: string,
    title?: string,
    timeout = 5000,
    callback?: () => any,
  ) => {
    Notification.error(message, title, timeout, callback);
  };
}

export default NotificationManager;
