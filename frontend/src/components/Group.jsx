import React from "react";
import { normalizeTime } from "../normalizeTime";
import Image from "../hooks/Image";
import avatar from "../public/avatar.svg";
import { useDispatch } from "react-redux";
import { setGroup } from "../store/slices/chatSlice";


function Group({ group }) {

    const dispatch = useDispatch()

    const handleClick = ()=>{
        dispatch(setGroup(group))
    }


  return (
    <div className="cursor-pointer flex px-3 py-2 gap-2 relative w-full items-center justify-center " onClick={handleClick}>
      <div className="absolute right-1 top-1 text-xs">
        {normalizeTime(group.lastMessageTime)}
      </div>
      <div className="bg-red-600 h-15 w-15 shrink-0 rounded-full overflow-hidden">
        <Image
          path={group.profileImgName}
          fallback={avatar}
          className="h-full w-full"
        />
      </div>
      <div className="grow min-w-0">
        <div className="text-ellipsis text-xl font-bold">{group.name}</div>
        <div className="text-ellipsis text-nowrap overflow-hidden text-sm">
          {group.sender && group.sender + " : " + group.latestMessage}
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
