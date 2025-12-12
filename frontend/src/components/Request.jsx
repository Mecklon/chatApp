import React, { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoCheckmarkOutline } from "react-icons/io5";
import Image from "../hooks/Image";
import avatar from "../public/avatar.svg";
import { normalizeTime } from "../normalizeTime";
import { useDispatch } from "react-redux";
import { addConnection, removeRequest } from "../store/slices/connectionsSlice";
import useGetFetch from "../hooks/useGetFetch";


function Request({ request }) {
  const { profileName, senderUsername, sentOn } = request;




  const dispatch = useDispatch()

  const {error, loading, fetch} = useGetFetch()

  const handleAccept = async ()=>{
    const connection = await fetch('/acceptRequest/'+senderUsername)
    dispatch(addConnection(connection))
    dispatch(removeRequest(request.id))
  }

  const handleReject = async()=>{
    await fetch("/rejectRequest/"+senderUsername)
    dispatch(removeRequest(request.id))
  }




  return (
    <div className="text-2xl flex gap-2 p-1 px-2 items-center justify-center relative">
      <div className="absolute top-0 right-0 text-sm p-1">
        {normalizeTime(sentOn)}
      </div>
      <div className="rounded-full bg-red-500 w-15 aspect-square flex items-center justify-center overflow-hidden">
        <Image path={profileName} fallback={avatar} className="h-full w-full" />
      </div>
      <div className="grow cursor-pointer hover:text-white duration-300">
        {senderUsername}
      </div>
      <div className="flex gap-1 items-center justify-center">
        <RxCross1 onClick={handleReject} className="cursor-pointer hover:scale-125 duration-300" />
        <IoCheckmarkOutline onClick={handleAccept} className="cursor-pointer text-[28px] hover:scale-125 duration-300" />
      </div>
    </div>
  );
}

export default Request;
