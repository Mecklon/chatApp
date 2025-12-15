import React, { useEffect, useRef } from "react";
import PrivateMessage from "./PrivateMessage";
import { useDispatch, useSelector } from "react-redux";
import { getGroupMessages, getMessages } from "../store/slices/chatSlice";
import { useAuthContext } from "../hooks/useAuthContext";
import GroupMessage from "./GroupMessage";
import loading from "../assets/loading.gif";

function Messages() {
  const { username } = useAuthContext();
  const dispatch = useDispatch();
  const chatInfo = useSelector((store) => store.chat);
  const chatRef = useRef();

  const bottomScrollLength = useRef(0);


  const maintainScroll = () => {
    chatRef.current.scrollTop =
      chatRef.current.scrollHeight -
      chatRef.current.offsetHeight -
      bottomScrollLength.current;
  };

  useEffect(() => {
    maintainScroll();
  }, [chatInfo.chats]);

  useEffect(()=>{
    bottomScrollLength.current =0
  },[chatInfo.changeIndicator])

  const endRef = useRef(null);

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
          firstPage:true
        })
      );
    } else {
      dispatch(
        getGroupMessages({
          id: chatInfo.grpInfo.id,
          cursor: cursor.toISOString().slice(0, 23),
          firstPage:true
        })
      );
    }
  }, [chatInfo.id, chatInfo.isPrivate]);
  // update dependency list

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (
        !entry.isIntersecting ||
        chatInfo.gettingMessage ||
        chatInfo.chats.length === 0 ||
        !chatInfo.hasMore
      )
        return;
      if (chatInfo.isPrivate) {
        dispatch(
          getMessages({
            username1: username,
            username2: chatInfo.userInfo.name,
            cursor: chatInfo.chats[0].time,
            firstPage: false
          })
        );
      } else {
        dispatch(
          getGroupMessages({
            id: chatInfo.grpInfo.id,
            cursor: chatInfo.chats[0].time,
            firsPage:false
          })
        );
      }
    });

    if (endRef.current) {
      observer.observe(endRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [chatInfo]);

  return (
    <div
      ref={chatRef}
      className="grow mx-1 flex flex-col gap-2 customScroll overflow-auto thinTrack pr-2 min-h-0 duration-300"
      onScroll={(e) => {
        bottomScrollLength.current =
          e.target.scrollHeight - e.target.offsetHeight - e.target.scrollTop;
      }}
    >
      {chatInfo.hasMore && (
        <div className="text-text" ref={endRef}>
          {" "}
          Loading..
        </div>
      )}
      {chatInfo.isPrivate &&
        chatInfo.chats.map((message, index) => {
          return (
            <PrivateMessage
              maintainScroll={maintainScroll}
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
              maintainScroll={maintainScroll}
              prev={prev}
              key={message.id}
              message={message}
              isSeen={chatInfo.pending < chatInfo.chats.length - index}
              hasReached={chatInfo.reached < chatInfo.chats.length - index}
            />
          );
        })}
      {chatInfo.typing && (
        <div className="bg-messageReceived  px-4 rounded-lg rounded-tl-none flex items-center justify-center w-fit">
          <img onLoad={maintainScroll} src={loading} className="w-15" />
        </div>
      )}
    </div>
  );
}

export default Messages;
