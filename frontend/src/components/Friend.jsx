import React from "react";
import Image from "../hooks/Image";
import avatar from "../public/avatar.svg";
import { useDispatch, useSelector } from "react-redux";
import { setPrivateRoom } from "../store/slices/chatSlice";
import { setUnseenZero } from "../store/slices/connectionsSlice";
import { normalizeTime } from "../normalizeTime";
function Friend({ connection }) {
  const dispatch = useDispatch();
  const chatInfo = useSelector(store=> store.chat)
  const handleClick = () => {
    if(chatInfo.id === connection.id)return
    dispatch(setPrivateRoom(connection));
    dispatch(setUnseenZero(connection.name));
  };

  const room = useSelector((store) => store.chat);
  
  return (
    <div
      onClick={handleClick}
      className="cursor-pointer flex px-3 py-2 gap-2 relative w-full items-center justify-center "
    >
      <div className="absolute right-1 top-1 text-xs">{normalizeTime(connection.postedOn)}</div>
      <div className="bg-red-600 h-15 w-15 shrink-0 rounded-full overflow-hidden">
        <Image
          path={connection.profileImgName}
          fallback={avatar}
          className="h-full w-full"
        />
      </div>
      <div className="grow min-w-0">
        <div className="text-ellipsis text-xl font-bold">{connection.name}</div>
        <div className="text-ellipsis text-nowrap overflow-hidden text-sm">
          {connection.sender && connection.sender + " : "+connection.content}
        </div>
      </div>
      {connection.pending != 0 && (
        <div className="bg-orange-500 shrink-0 w-6 h-6 mt-3 text-center [verticle-align:center] text-white rounded-full ">
          {connection.pending}
        </div>
      )}
    </div>
  );
}

export default Friend;
