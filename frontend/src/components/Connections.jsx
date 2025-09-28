import React, { useState } from "react";
import { FaChevronUp } from "react-icons/fa";

function Connections() {
  const [openConversations, setOpenConversations] = useState(true);
  const [openGroups, setOpenGroups] = useState(true);
  return (
    <div className=" flex-1 overflow-auto customScroll">
      <div
        className="text-2xl font-bold p-2 flex items-center justify-between"
        onClick={() => setOpenConversations((prev) => !prev)}
      >
        <div>Converstions</div>
        <FaChevronUp
          className={`${
            openConversations && "rotate-180"
          } text-xl duration-300`}
        />
      </div>
      {openConversations && (
        <>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
        </>
      )}
      <div
        className="text-2xl font-bold p-2 flex items-center justify-between"
        onClick={() => setOpenGroups((prev) => !prev)}
      >
        <div>Groups</div>
        <FaChevronUp
          className={`${openGroups && "rotate-180"} text-xl duration-300`}
        />
      </div>
      {openGroups && (
        <>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
          <div className="bg-pink-500 h-12 rounded-2xl mb-2"></div>
        </>
      )}
    </div>
  );
}

export default Connections;
