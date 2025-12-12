import { useDispatch, useSelector } from "react-redux";
import Image from "../hooks/Image";
import { normalizeTime } from "../normalizeTime";
import { TbDotsVertical } from "react-icons/tb";
import { setExpanded } from "../store/slices/TileSlice";
import defaultAvatar from '../assets/defaultAvatar.webp'
import defaultGroupAvatar from '../assets/defaultGroupAvatar.jpg'

function ChatInfo() {
  const room = useSelector((store) => store.chat);

  const dispatch = useDispatch();

  if (room.isPrivate === false) {
    return (
      <div className="flex gap-4 justify-baseline text-text items-center p-1">
        <div className="h-15 w-15 rounded-full overflow-hidden">
          <Image path={room.grpInfo.profileImgName} fallback={defaultAvatar} className="h-full w-full" />
        </div>

        <div className="text-3xl font-bold">{room.grpInfo.name}</div>
        <div
        className="p-1 rounded-full ml-auto hover:bg-[rgba(0,0,0,0.5)] duration-200 cursor-pointer"
        onClick={() => dispatch(setExpanded(true))}
      >
        <TbDotsVertical className=" text-3xl" />
      </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-baseline text-text items-center p-1">
      <div className="h-15 w-15 rounded-full overflow-hidden">
        <Image path={room.userInfo.profileImgName} fallback={defaultGroupAvatar} className="h-full w-full" />
      </div>

      <div>
        <div className="text-3xl font-bold">{room.userInfo.name}</div>
        {room.userInfo.online ? (
          <div>Online</div>
        ) : (
          <div>{"Last seen, " + normalizeTime(room.userInfo.lastSeen)}</div>
        )}
      </div>

      <div
        className="p-1 rounded-full ml-auto hover:bg-[rgba(0,0,0,0.5)] duration-200 cursor-pointer"
        onClick={() => dispatch(setExpanded(true))}
      >
        <TbDotsVertical className=" text-3xl" />
      </div>
    </div>
  );
}

export default ChatInfo;
