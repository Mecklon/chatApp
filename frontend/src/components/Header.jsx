import React, { useEffect, useRef, useState } from "react";
import { PiGraphLight } from "react-icons/pi";
import DropDown from "./DropDown";
import avatar from "../public/avatar.svg";
import { useAuthContext } from "../hooks/useAuthContext";
import Image from "../hooks/Image";
import { MdMail } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import Requests from "./Requests";
import Notifications from "./Notifications";
import { MdSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef();
  const triggerRef = useRef();

  const [requestIsOpen, setRequestIsOpen] = useState(false);
  const requestRef = useRef();
  const requestTrigger = useRef();

  const [notificationIsOpen, setNotificationIsOpen] = useState(false);
  const notificationRef = useRef();
  const notificationTrigger = useRef();

  const { unseenRequests, unseenNotifications } = useAuthContext();

  const [theme, setTheme] = useState(() => {
    const theme = localStorage.getItem("theme");
    if (theme === null && theme === "false") return false;
    return true;
  });

  const { username, profile } = useAuthContext();
  useEffect(() => {
    const handleFocus = (event) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleRequestFocus = (event) => {
      if (
        requestRef.current &&
        !requestRef.current.contains(event.target) &&
        requestTrigger.current &&
        !requestTrigger.current.contains(event.target)
      ) {
        setRequestIsOpen(false);
      }
    };

    const handleNotificatinFocus = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        notificationTrigger.current &&
        !notificationTrigger.current.contains(event.target)
      ) {
        setNotificationIsOpen(false);
      }
    };

    document.addEventListener("click", handleFocus);
    document.addEventListener("click", handleRequestFocus);
    document.addEventListener("click", handleNotificatinFocus);

    return () => {
      document.removeEventListener("click", handleFocus);
      document.removeEventListener("click", handleRequestFocus);
      document.removeEventListener("click", handleNotificatinFocus);
    };
  }, []);

  return (
    <div
      className=" [grid-area:header] flex 
    z-10 items-center justify-between p-1 relative"
    >
      <div className="flex gap-1 items-center p-1 text-2xl font-bold text-text">
        <PiGraphLight className="text-5xl text-text" />
        Uni Talk
      </div>
      <div className="h-full flex gap-4 items-center text-text cursor-pointer text-3xl">
        <div
          onClick={(e) => {
            if (document.documentElement.classList.contains("dark")) {
              localStorage.setItem("theme", false);
              document.documentElement.classList.remove("dark");
              setTheme(false);
            } else {
              localStorage.setItem("theme", true);
              document.documentElement.classList.add("dark");
              setTheme(true);
            }
          }}
        >
          {theme ? <MdSunny /> : <IoMdMoon />}
        </div>
        <div className="relative ">
          {requestIsOpen && <Requests state={[]} ref={requestRef} />}
          {unseenRequests != 0 && (
            <div className="absolute bg-red-600 text-sm flex items-center rounded-full justify-center text-white h-5 w-5 z-0 bottom-3/4 right-3/4">
              {unseenRequests}
            </div>
          )}

          <IoPersonAddSharp
            ref={requestTrigger}
            onClick={() => setRequestIsOpen(true)}
            className="text-3xl z-10 hover:scale-110 duration-200 cursor-pointer"
          />
        </div>
        <div className="relative">
          {notificationIsOpen && (
            <Notifications state={[]} ref={notificationRef} />
          )}
          {unseenNotifications != 0 && (
            <div className="absolute bg-red-600 text-sm flex items-center rounded-full justify-center text-white h-5 w-5 z-0 bottom-3/4 right-3/4">
              {unseenNotifications}
            </div>
          )}

          <MdMail
            ref={notificationTrigger}
            onClick={() => setNotificationIsOpen(true)}
            className="text-3xl hover:scale-110 duration-200 cursor-pointer"
          />
        </div>
        <div
          className="cursor-pointer flex gap-2 h-full items-center"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          ref={triggerRef}
        >
          <div className="text-2xl font-bold">{username}</div>
          <div className="bg-stone-600 rounded-full h-[80%] aspect-square flex items-center justify-center overflow-hidden">
            {/* <img className="h-3/4" src={profile? profile: avatar} alt="" /> */}
            <Image
              path={profile}
              className="h-full aspect-square"
              fallback={avatar}
            />
          </div>
        </div>
        {isOpen && <DropDown ref={dropDownRef} />}
      </div>
    </div>
  );
}

export default Header;
