import { CircleAlert, CircleCheck, CircleX, X } from "lucide-react";
import { useNotification } from "./clientComponent/providers/notificationProvider";
import { useCallback } from "react";

export function NotificationDisplay() {
  const { notification } = useNotification();

  // will return a component notification depends on the type of the notification
  const notif = useCallback(() => {
    if (notification.type === "success") return <SuccessNotification />;
    else if (notification.type === "warning") return <WarningNotification />;
    else if (notification.type === "error") return <ErrorNotification />;
    else return null;

    // after a certain time the value of the notification will go back to its defaul value
  }, [notification]);

  return <div>{notif()}</div>;
}

function SuccessNotification() {
  const { notification } = useNotification();
  return (
    <div className="ring-green-400 bg-green-200 text-green-900 notif ">
      <div className="flex flex-row items-center justify-evenly gap-5">
        <CircleCheck className="size-10 " />
        <div>
          <span>System Notification</span>
          <p>{notification.message}</p>
        </div>
        <X className="size-5 hover:scale-120 active:outline-2" />
      </div>
    </div>
  );
}

function WarningNotification() {
  const { notification } = useNotification();
  return (
    <div className=" ring-yellow-400 bg-yellow-100 text-yellow-900 notif">
      <div className="flex flex-row items-center justify-evenly gap-5">
        <CircleX className="size-10 " />
        <div>
          <span>System Notification</span>
          <p>{notification.message}</p>
        </div>
        <X className="size-5 hover:scale-120 active:outline-2" />
      </div>
    </div>
  );
}

function ErrorNotification() {
  const { notification } = useNotification();
  return (
    <div className=" rign-red-400 bg-red-100 text-red-900 notif">
      <div className="w-full flex flex-row items-center justify-evenly gap-5">
        <CircleAlert className="size-10 " />
        <div>
          <span>System Notification</span>
          <p>{notification.message}</p>
        </div>
        <X className="size-5 hover:scale-120 active:outline-2" />
      </div>
    </div>
  );
}
