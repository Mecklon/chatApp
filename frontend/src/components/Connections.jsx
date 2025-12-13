import React, { useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import Friend from "./Friend";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import CreateGroupForm from "./CreateGroupForm";
import Group from "./Group";

function Connections() {
  const [openConversations, setOpenConversations] = useState(true);
  const [openGroups, setOpenGroups] = useState(true);

  const { connections, groups } = useSelector((store) => store.connection);

  const [isGroupCreatorOpen, setIsGroupCreatorOpen] = useState(false);

  const openCreateGroup = (e) => {
    e.stopPropagation();
    setIsGroupCreatorOpen(true);
  };

  return (
    <div className=" flex-1 overflow-auto  customScroll w-full">
        <div
          className="text-2xl font-bold p-2 flex items-center justify-between"
          onClick={() => setOpenConversations((prev) => !prev)}
        >
          <div className="text-text">Converstions</div>
          <FaChevronUp
            className={`${
              openConversations && "rotate-180"
            } text-xl duration-300 hover:scale-140 text-text`}
          />
        </div>
        {openConversations && (
          <>
            {connections.map((connection) => {
              return <Friend key={connection.id} connection={connection} />;
            })}
          </>
        )}
        <div
          className="text-2xl font-bold p-2 flex items-center justify-between"
          onClick={() => setOpenGroups((prev) => !prev)}
        >
          <div className="text-text">Groups</div>
          <div className="flex gap-1">
            <FaPlus
              onClick={openCreateGroup}
              className={`-xl duration-300 hover:scale-140 text-text`}
            />

            <FaChevronUp
              className={`${
                openGroups && "rotate-180"
              } text-xl duration-300 hover:scale-140 text-text`}
            />
          </div>
        </div>
        {openGroups &&
          groups.map((group) => <Group key={group.id} group={group} />)}
        {isGroupCreatorOpen && (
          <CreateGroupForm setIsOpen={setIsGroupCreatorOpen} />
        )}
    </div>
  );
}

export default Connections;
