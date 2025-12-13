import Image from "../hooks/Image";
import { normalizeTime } from "../normalizeTime";
import avatar from "../assets/defaultAvatar.webp";
import groupAvatar from "../assets/defaultGroupAvatar.jpg";
function Notification({ notification }) {
  return (
    <div className="p-2 border-t border-border flex gap-2 ">
      <div className="h-[50px] w-[50px] overflow-hidden rounded-full shrink-0">
        <Image
          path={
            notification.senderProfile
              ? notification.senderProfile
              : notification.groupProfile
          }
          fallback={notification.groupid ? avatar : groupAvatar}
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
          {notification.typeId === 3 && (
            <>
              You were kicked out of <strong>{notification.groupName}</strong>
            </>
          )}
          {notification.typeId === 4 && (
            <>
              You were added to group <strong>{notification.groupName}</strong>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default Notification;
