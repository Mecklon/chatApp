import React from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { IoCheckmarkOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";
import { normalizeTime } from "../normalizeTime";
import { IoCheckmark } from "react-icons/io5";
import Multimedia from "./Multimedia";

function PrivateMessage({ message, isSeen, hasReached }) {
  const { username } = useAuthContext();
  if (username === message.username) {
    return (
      <div
        className={`x${
          message.media.length === 0 ? "max-w-3/4" : " w-3/4"
        } self-end`}
      >
        <div className="rounded-lg rounded-tr-none bg-blue-500 p-1.5 text-2xl">
          <div className="mb-2">{message.content}</div>
          {message.media.length != 0 && (
            <Multimedia media={message.media}></Multimedia>
          )}
        </div>
        <div className="flex gap-1 text-sm items-center justify-end">
          {isSeen === true ? (
            <IoCheckmarkDone className="text-blue-500 text-2xl" />
          ) : hasReached === true ? (
            <IoCheckmarkDone className=" text-2xl" />
          ) : message.notsaved === true ? (
            <FaRegClock className=" text-2xl" />
          ) : (
            <IoCheckmark className=" text-2xl" />
          )}
          <div>{normalizeTime(message.time)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3/4 self-start mt-1">
      <div className="rounded-lg rounded-tl-none bg-red-500 p-1.5 text-2xl">
        <div className="mb-1">{message.content}</div>
        {message.media.length != 0 && (
          <Multimedia media={message.media}></Multimedia>
        )}
      </div>
      <div className="text-sm">{normalizeTime(message.time)}</div>
    </div>
  );
}

export default PrivateMessage;
