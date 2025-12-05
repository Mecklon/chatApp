
import Image from "../hooks/Image";
import { normalizeTime } from "../normalizeTime";
import avatar from "../public/avatar.svg";
function Notification({ notification }) {
  
  return (
    <div className="p-2 flex gap-2 bg-red-600">
      <div className="h-[50px] w-[50px] overflow-hidden rounded-full bg-orange-700 shrink-0">
        <Image
          path={
            notification.senderProfile
              ? notification.senderProfile
              : notification.groupProfile
          }
          fallback={avatar}
          className="h-full"
        />
      </div>
      <div className="grow">
        <div className="text-sm text-right">
          {normalizeTime(notification.postedOn)}
        </div>
        <div className="text-lg">
          {notification.typeId === 1 && (
            <>
              <strong>{notification.senderName}</strong> has accepted your
              friend request
            </>
          )}
          {notification.typeId === 2 && (
            <>
              <strong>{notification.senderName}</strong> has rejected your
              friend request
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;
