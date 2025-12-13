import React, { useEffect, useRef, useState } from "react";
import { GoPaperclip } from "react-icons/go";
import { RiSendPlaneFill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, sendMessage } from "../store/slices/chatSlice";
import { useAuthContext } from "../hooks/useAuthContext";
import { nanoid } from "@reduxjs/toolkit";
import { FaMusic } from "react-icons/fa6";
import pdf from "../assets/pdf.png";
import powerpoint from "../assets/powerpoint.png";
import excel from "../assets/excel.png";
import word from "../assets/word.png";
import useWebSocketContext from "../hooks/useWebsocketContext";
import {
  updateLatestMessage,
  updateLatestGroupMessage,
} from "../store/slices/connectionsSlice";
import { formatTimeString } from "../formatTimeString";

function MessageInput() {
  const fileInputRef = useRef();
  const textInputRef = useRef();

  const chatInfo = useSelector((store) => store.chat);

  const [files, setFiles] = useState([]);
  const { username } = useAuthContext();
  const dispatch = useDispatch();

  const handleFileInput = () => {
    const newFiles = Array.from(fileInputRef.current.files);
    setFiles((prev) => {
      return [
        ...prev,
        ...newFiles.map((file) => ({
          id: nanoid(),
          file,
          frontEndObj: URL.createObjectURL(file),
        })),
      ];
    });
  };

  const { client } = useWebSocketContext();
  const handleType = () => {
    let body;
    if (chatInfo.isPrivate) {
      body = {
        receiver: chatInfo.userInfo.name,
        private: true,
      };
    } else {
      body = {
        receiver: chatInfo.grpInfo.id,
        private: false,
      };
    }
    client.publish({
      destination: "/app/chat/typing",
      body: JSON.stringify(body),
    });
  };

  const handleOverflow = (e) => {
    const el = e.target;
    el.style.height = "auto";
    const newHeight = el.scrollHeight;
    if (newHeight > 180) {
      el.style.height = "180px";
      el.style.overflowY = "auto";
    } else {
      el.style.height = newHeight + "px";
      el.style.overflowY = "hidden";
    }
  };

  const handleRemoveFile = (i) => {
    setFiles((prev) => {
      return prev.filter((file, index) => {
        return index != i;
      });
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (textInputRef.current.value.trim() === "" && files.length === 0) {
      return;
    }
    if (textInputRef.current.value.trim() !== "") {
      formData.append("text", textInputRef.current.value);
    }
    files.forEach((file) => {
      formData.append("files", file.file);
    });

    if (chatInfo.isPrivate) {
      formData.append("receiver", chatInfo.userInfo.name);
    } else {
      formData.append("groupId", chatInfo.id);
    }

    const id = nanoid();
    dispatch(sendMessage({ formData, id, isPrivate: chatInfo.isPrivate }));
    const now = new Date();
    dispatch(
      addMessage({
        content: textInputRef.current.value,
        time: formatTimeString(),
        media: files.map((file) => {
          return {
            id: file.id,
            frontEndObj: file.frontEndObj,
            fileType: file.file.type,
          };
        }),
        username,
        saved: false,
        id,
        notsaved: true,
      })
    );

    if (chatInfo.isPrivate) {
      dispatch(
        updateLatestMessage({
          content: textInputRef.current.value,
          sender: username,
          time: formatTimeString(),
          contact: chatInfo.userInfo.name,
        })
      );
    } else {
      dispatch(
        updateLatestGroupMessage({
          content: textInputRef.current.value,
          sender: username,
          time: formatTimeString(),
          id: chatInfo.grpInfo.id,
        })
      );
    }

    textInputRef.current.value = "";
    setFiles([]);
    handleOverflow(e);
  };

  useEffect(() => {
    textInputRef.current.value = "";
  }, [chatInfo.userInfo, chatInfo.grpInfo]);

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex gap-1 items-baseline relative  shrink-0"
    >
      <div className="absolute bottom-full flex gap-1  mb-1  w-full customScroll thinTrack  shrink-0">
        {files.map((file, index) => {
          return (
            <div
              key={file.frontEndObj}
              className="shrink-0 relative h-20 w-20 rounded-lg overflow-hidden border border-border"
            >
              {file.file.type.split("/")[0] === "image" ? (
                <img
                  className="h-full w-full object-contain bg-black"
                  src={file.frontEndObj}
                />
              ) : file.file.type.split("/")[0] === "video" ? (
                <video
                  className="h-full w-full object-contain bg-black"
                  src={file.frontEndObj}
                />
              ) : file.file.type === "application/pdf" ? (
                <div className="bg-black h-full w-full">
                  <img src={pdf} alt="" />
                </div>
              ) : file.file.type === "text/plain" ? (
                <div className="bg-black h-full w-full flex items-center justify-center">
                  <img src={word} className="h-[90%]" alt="" />
                </div>
              ) : file.file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? (
                <div className="bg-black h-full w-full flex items-center justify-center">
                  <img src={excel} className="h-[90%]" alt="" />
                </div>
              ) : file.file.type ===
                "application/vnd.openxmlformats-officedocument.presentationml.presentation" ? (
                <div className="bg-black h-full w-full flex items-center justify-center">
                  <img src={powerpoint} className="h-[90%]" alt="" />
                </div>
              ) : (
                <div className="bg-black h-full w-full flex items-center justify-center">
                  <FaMusic className="text-white text-2xl" />
                </div>
              )}
              <RxCross1
                onClick={() => handleRemoveFile(index)}
                className="top-1 text-lg cursor-pointer right-1 absolute p-1 bg-[rgba(255,255,255,0.4)] rounded-full "
              />
            </div>
          );
        })}
      </div>
      <input
        id="fileInput"
        onChange={handleFileInput}
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
      />
      <div className="bg-bg-light border border-border text-text  items-end shrink-0 p-3 grow flex gap-2 rounded-4xl ">
        <label htmlFor="fileInput">
          <GoPaperclip className="text-3xl cursor-pointer hover:scale-125 duration-300" />
        </label>
        <textarea
          rows={1}
          onChange={(e)=>{
            handleOverflow(e)
            handleType()
          }}
          type="text"
          ref={textInputRef}
          className="grow customScroll outline-0 text-2xl resize-none"
        />
      </div>
      <button className="flex items-center justify-center h-13 w-13 bg-secondary text-text rounded-full cursor-pointer">
        <RiSendPlaneFill className="text-3xl " />
      </button>
    </form>
  );
}

export default MessageInput;
