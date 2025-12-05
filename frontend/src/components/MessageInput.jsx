import React, { useRef, useState } from "react";
import { GoPaperclip } from "react-icons/go";
import { RiSendPlaneFill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, sendMessage } from "../store/slices/chatSlice";
import { useAuthContext } from "../hooks/useAuthContext";
import { nanoid } from "@reduxjs/toolkit";
import { updateLatestMessage } from "../store/slices/connectionsSlice";
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
          file,
          frontEndObj: URL.createObjectURL(file),
        })),
      ];
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
    
    formData.append("receiver", chatInfo.userInfo.name)

    const id = nanoid()
    dispatch(sendMessage({formData,id}));
    const now = new Date();
    dispatch(
      addMessage({
        content: textInputRef.current.value,
        time: formatTimeString(),
        media: files.map((file) => file.frontEndObj),
        username,
        saved: false,
        id,
        notsaved: true
      })
    );

    dispatch(updateLatestMessage({
      content: textInputRef.current.value,
      sender:username,
      time: formatTimeString(),
      contact: chatInfo.userInfo.name
    }))

    textInputRef.current.value =""
    setFiles([])
    handleOverflow(e)
    
  };
  return (
    <form
      onSubmit={handleSendMessage}
      className="bg-teal-600 flex gap-1 items-baseline relative"
    >
      <div className="absolute bottom-full flex gap-1  mb-1 overflow-auto w-full customScroll thinTrack">
        {files.map((file, index) => {
          return (
            <div
              key={file.frontEndObj}
              className="shrink-0 relative h-20 w-20 rounded-lg overflow-hidden border border-stone-700"
            >
              <img className="h-full w-full" src={file.frontEndObj} />
              <RxCross1
                onClick={() => handleRemoveFile(index)}
                className="top-1 text-lg cursor-pointer right-1 absolute "
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
      <div className="bg-stone-700 items-end  p-3 grow flex gap-2 rounded-4xl ">
        <label htmlFor="fileInput">
          <GoPaperclip className="text-3xl cursor-pointer" />
        </label>
        <textarea
          rows={1}
          onChange={handleOverflow}
          type="text"
          ref={textInputRef}
          className="grow customScroll outline-0 text-2xl resize-none"
        />
      </div>
      <button className="flex items-center justify-center h-13 w-13 bg-red-500 rounded-full cursor-pointer">
        <RiSendPlaneFill className="text-3xl " />
      </button>
    </form>
  );
}

export default MessageInput;
