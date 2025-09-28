import React, { useEffect, useRef, useState } from "react";
import { PiGraphLight } from "react-icons/pi";
import DropDown from "./DropDown";
import avatar from "../public/avatar.svg";
import { useAuthContext } from "../hooks/useAuthContext";
import Image from "../hooks/Image";
import { MdMail } from "react-icons/md";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef();
  const triggerRef = useRef();

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

    document.addEventListener("click", handleFocus);
    return () => {
      document.removeEventListener("click", handleFocus);
    };
  }, []);

  return (
    <div className="bg-amber-950 [grid-area:header] flex items-center justify-between p-1 relative">
      <div className="flex gap-1 items-center p-1 text-2xl font-bold text-primary">
        <PiGraphLight className="text-5xl text-primary" />
        Uni Talk
      </div>
      <div className="h-full flex gap-6 items-center">
        <MdMail className="text-4xl hover:scale-110 duration-200 cursor-pointer" />
        <div
          className="cursor-pointer flex gap-2 h-full items-center"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          ref={triggerRef}
        >
          <div className="bg-stone-600 rounded-full h-[80%] aspect-square flex items-center justify-center overflow-hidden">
            {/* <img className="h-3/4" src={profile? profile: avatar} alt="" /> */}
            <Image
              path={profile}
              className="h-full aspect-square"
              fallback={avatar}
            />
          </div>
          <div className="text-2xl font-bold">{username}</div>
        </div>
        {isOpen && <DropDown ref={dropDownRef} />}
      </div>
    </div>
  );
}

export default Header;
