import React from "react";
import Image from "../hooks/Image";
import { FaCirclePlus } from "react-icons/fa6";
function People({ searchList, setSearchList }) {
  return (
    <div className="py-2">
      {searchList.map((person) => {
        return (
          <div key={person.id} className="flex items-center gap-2 cursor-pointer py-2 px-1 bg-amber-500">
            <div className="h-15 w-15 rounded-full overflow-hidden">
              <Image path={person.fileName} className="h-full w-full" />
            </div>
            <div className="grow text-2xl font-bold">
              <div>{person.username}</div>
            </div>
            <div>
              <FaCirclePlus className="text-4xl cursor-pointer hover:scale-110 duration-200"/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default People;
