import React, { useState } from "react";
import Image from "../hooks/Image";
import rolling from "../assets/rolling2.gif";
import avatar from "../public/avatar.svg";
import { FaCirclePlus } from "react-icons/fa6";
import { IoCheckmarkSharp } from "react-icons/io5";
import usePostFetch from "../hooks/usePostFetch";

function Person({ person }) {
  const { error, state, loading, fetch } = usePostFetch();

  const handleSendRequest = async() => {
    await fetch("/sendRequest" , {receiverUsername:person.username});
  };

  
  return (
    <div
      key={person.id}
      className="flex items-center gap-2  py-2 px-1 bg-amber-500"
    >
      <div className="h-15 w-15 rounded-full overflow-hidden">
        <Image
          path={person.fileName}
          fallback={avatar}
          className="h-full w-full cursor-pointer"
        />
      </div>
      <div className="grow text-2xl font-bold">
        <div>{person.username}</div>
      </div>
      <div>
        {!loading && state === null && (
          <FaCirclePlus onClick={handleSendRequest} className="text-4xl cursor-pointer hover:scale-110 duration-200" />
        )}
        {!loading && state && <IoCheckmarkSharp className="text-4xl " />}
        {loading && (
          <div >
            <img src={rolling} alt="" className="h-[3rem]" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Person;
