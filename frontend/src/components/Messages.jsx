import React, { useEffect, useRef } from "react";
import PrivateMessage from "./PrivateMessage";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../store/slices/chatSlice";
import { useAuthContext } from "../hooks/useAuthContext";

function Messages() {
  const { username } = useAuthContext();
  const dispatch = useDispatch();
  const chatInfo = useSelector((store) => store.chat);
  const chatRef = useRef();

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatInfo.chats]);

  useEffect(() => {
    if (chatInfo.isPrivate) {
      let cursor = new Date();
      cursor.setMonth(cursor.getMonth() + 1);
      dispatch(
        getMessages({
          username1: username,
          username2: chatInfo.userInfo.name,
          cursor: cursor.toISOString().slice(0, 23),
        })
      );
    }else{
      // get group messages
    }
  }, [chatInfo.id, chatInfo.isPrivate]);
  // update dependency list
  return (
    <div
      ref={chatRef}
      className="grow mx-1 flex flex-col gap-2 customScroll overflow-auto thinTrack"
    >
      {chatInfo.chats.map((message, index) => {
        return (
          <PrivateMessage
            key={message.id}
            message={message}
            isSeen={chatInfo.pending < chatInfo.chats.length - index}
            hasReached={chatInfo.reached < chatInfo.chats.length - index}
          />
        );
      })}
    </div>
  );
}

export default Messages;
