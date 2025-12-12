import React from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { IoCheckmarkOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";
import { normalizeTime } from "../normalizeTime";
import { IoCheckmark } from "react-icons/io5";
import Multimedia from "./Multimedia";

function PrivateMessage({ message, isSeen, hasReached,scrollBottom }) {
  const { username } = useAuthContext();
  
  if (username === message.username) {
    return (
      <div
        className={`${
          message.media.length === 0 ? "max-w-3/4" : " w-3/4"
        } self-end`}
      >
        <div className="rounded-lg rounded-tr-none text-text bg-messageSelf p-1.5 text-2xl">
          <div className="mb-2 break-all">{message.content}</div>
          {message.media.length != 0 && (
            <Multimedia scrollBottom={scrollBottom} media={message.media} preview={message.notsaved}></Multimedia>
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
          <div className="text-text">{normalizeTime(message.time)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${
          message.media.length === 0 ? "max-w-3/4 " : " w-3/4 "
        } self-start mt-1`}>
      <div className="rounded-lg rounded-tl-none bg-messageReceived text-text p-1.5 text-2xl">
        <div className="mb-1 break-all">{message.content}</div>
        {message.media.length != 0 && (
          <Multimedia scrollBottom={scrollBottom} media={message.media} preview={message.notsaved}></Multimedia>
        )}
      </div>
      <div className="text-sm text-text">{normalizeTime(message.time)}</div>
    </div>
  );
}

export default PrivateMessage;
