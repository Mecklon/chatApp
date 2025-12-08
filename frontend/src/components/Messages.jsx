import React, { useEffect, useRef } from "react";
import PrivateMessage from "./PrivateMessage";
import { useDispatch, useSelector } from "react-redux";
import { getGroupMessages, getMessages } from "../store/slices/chatSlice";
import { useAuthContext } from "../hooks/useAuthContext";
import GroupMessage from "./GroupMessage";

function Messages() {
  const { username } = useAuthContext();
  const dispatch = useDispatch();
  const chatInfo = useSelector((store) => store.chat);
  const chatRef = useRef();

  const scrollBottom = () => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollBottom();
  }, [chatInfo.chats]);

  // maybe this needs to be in friend component
  useEffect(() => {
    let cursor = new Date();
    cursor.setMonth(cursor.getMonth() + 1);
    if (chatInfo.isPrivate) {
      dispatch(
        getMessages({
          username1: username,
          username2: chatInfo.userInfo.name,
          cursor: cursor.toISOString().slice(0, 23),
        })
      );
    } else {
      dispatch(
        getGroupMessages({
          id: chatInfo.grpInfo.id,
          cursor: cursor.toISOString().slice(0, 23),
        })
      );
    }
  }, [chatInfo.id, chatInfo.isPrivate]);
  // update dependency list
  return (
    <div
      ref={chatRef}
      className="grow mx-1 flex flex-col gap-2 customScroll overflow-auto thinTrack"
    >
      {chatInfo.isPrivate &&
        chatInfo.chats.map((message, index) => {
          return (
            <PrivateMessage
              scrollBottom={scrollBottom}
              key={message.id}
              message={message}
              isSeen={chatInfo.pending < chatInfo.chats.length - index}
              hasReached={chatInfo.reached < chatInfo.chats.length - index}
            />
          );
        })}
      {!chatInfo.isPrivate &&
        chatInfo.chats.map((message, index) => {
          const prev = index === 0 ? null : chatInfo.chats[index - 1].username;
          return (
            <GroupMessage
              scrollBottom={scrollBottom}
              prev={prev}
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
