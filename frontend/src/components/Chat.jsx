import React, { useEffect, useRef } from "react";
import ChatInfo from "./ChatInfo";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

function Chat() {
  const room = useSelector((store) => store.chat);

  if (!room.id) {
    return (
      <div className="[grid-area:main] [min-width:400px] text-center text-5xl font-bold pt-10 h-full">Select a chat</div>
    );
  }
  return (
    <div className="bg-red-300 [grid-area:main] flex flex-col h-full min-h-0">
      <ChatInfo />
      <Messages />
      <MessageInput />
    </div>
  );
}

export default Chat;
