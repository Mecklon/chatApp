import React from "react";
import { useSelector } from "react-redux";
import Image from "../hooks/Image";
import avatar from "../public/avatar.svg";
import { normalizeTime } from "../normalizeTime";
import { TfiControlShuffle } from "react-icons/tfi";

function ChatInfo() {
  const room = useSelector((store) => store.chat);
  if (room.isPrivate === false) {
    return (
      <div className="flex gap-4 justify-baseline bg-red-600 items-center p-1">
        <div className="h-15 w-15 rounded-full overflow-hidden">
          <Image path={room.grpInfo.profileImgName} className="h-full w-full" />
        </div>

        <div className="text-3xl font-bold">{room.grpInfo.name}</div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-baseline bg-red-600 items-center p-1">
      <div className="h-15 w-15 rounded-full overflow-hidden">
        <Image path={room.userInfo.profileImgName} className="h-full w-full" />
      </div>

      <div>
        <div className="text-3xl font-bold">{room.userInfo.name}</div>
        {room.userInfo.online ? (
          <div>Online</div>
        ) : (
          <div>{"Last seen, " + normalizeTime(room.userInfo.lastSeen)}</div>
        )}
      </div>
    </div>
  );
}

export default ChatInfo;
