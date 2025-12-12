import React from "react";
import { normalizeTime } from "../normalizeTime";
import Image from "../hooks/Image";
import avatar from "../public/avatar.svg";
import { useDispatch, useSelector } from "react-redux";
import { setGroup } from "../store/slices/chatSlice";
import { setUnseenGroupZero } from "../store/slices/connectionsSlice";
import { useSearchParams } from "react-router-dom";
import { setExpanded } from "../store/slices/TileSlice";

function Group({ group }) {
  const dispatch = useDispatch();
  const chatInfo = useSelector((store) => store.chat);

  const handleClick = () => {
    if (chatInfo.id === group.id) return;
    dispatch(setGroup(group));
    dispatch(setUnseenGroupZero(group.id));
    dispatch(setExpanded(false));
  };

  return (
    <div
      className="cursor-pointer bg-bg-light rounded-lg mb-1 flex px-3 py-2 gap-2 relative w-full items-center justify-center "
      onClick={handleClick}
    >
      <div className="absolute right-2 top-2 text-xs text-text">
        {normalizeTime(group.lastMessageTime)}
      </div>
      <div className="bg-stone-600 h-15 w-15 shrink-0 rounded-full overflow-hidden">
        <Image
          path={group.profileImgName}
          fallback={avatar}
          className="h-full w-full"
        />
      </div>
      <div className="grow min-w-0 text-text">
        <div className="text-ellipsis text-xl font-bold">{group.name}</div>
        <div className="text-ellipsis text-nowrap overflow-hidden text-sm">
          {group.sender && group.sender + " : "}

          {group.latestMessage && group.latestMessage}
        </div>
      </div>
      {group.pending != 0 && (
        <div className="bg-orange-500 shrink-0 w-6 h-6 mt-3 text-center [verticle-align:center] text-white rounded-full ">
          {group.pending}
        </div>
      )}
    </div>
  );
}

export default Group;
