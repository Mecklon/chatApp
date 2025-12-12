import { useAuthContext } from "../hooks/useAuthContext";
import React from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { IoCheckmarkOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { normalizeTime } from "../normalizeTime";
import { IoCheckmark } from "react-icons/io5";
import Image from "../hooks/Image";
import Multimedia from "./Multimedia";
function GroupMessage({ message, isSeen, hasReached, prev, scrollBottom }) {
  const { username } = useAuthContext();
  if (message.username === null) {
    return (
      <div className="self-center max-w-1/2">
        <div className="p-1.5 rounded-lg text-2xl text-text px-4 bg-stone-600 ">
          {message.content}
        </div>
        <div className="ml-auto">{normalizeTime(message.time)}</div>
      </div>
    );
  }

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
            <Multimedia
              scrollBottom={scrollBottom}
              media={message.media}
              preview={message.notsaved}
            ></Multimedia>
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
    <div className="flex gap-2 text-text items-start">
      {prev !== message.username ? (
        <Image
          path={message.profileImgName}
          className={" rounded-full h-15 w-15"}
        />
      ) : (
        <div className="h-15 w-15"></div>
      )}
      <div
        className={`${
          message.media.length === 0 ? "max-w-3/4" : "w-3/4"
        } flex flex-col`}
      >
        {prev !== message.username && (
          <div className="text-xl font-medium mb-0.5">{message.username}</div>
        )}
        <div className={`rounded-lg rounded-tl-none bg-messageReceived p-1.5 text-2xl`}>
          <div className="mg-2 break-all">{message.content}</div>
          {message.media.length != 0 && (
            <Multimedia
              scrollBottom={scrollBottom}
              media={message.media}
              preview={message.notsaved}
            ></Multimedia>
          )}
        </div>
        <div className="text-sm">{normalizeTime(message.time)}</div>
      </div>
    </div>
  );
}

export default GroupMessage;
