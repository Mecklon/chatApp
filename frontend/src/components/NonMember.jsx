import React, { useState } from "react";
import Image from "../hooks/Image";
import avatar from "../assets/defaultAvatar.webp";
import usePostFetch from "../hooks/usePostFetch";
import { FaPlus } from "react-icons/fa6";
import rolling from "../assets/rolling2.gif";
import ConfirmationBox from "./ConfirmationBox";

function NonMember({ connection, setMembers,grpName, grpId }) {
  const { loading, fetch } = usePostFetch();

  const handleAdd = async () => {
    setMembers((prev) => {
      return [
        {
          username: connection.name,
          profileImgName: connection.profileImgName,
          admin: false,
        },
        ...prev,
      ];
    });

    

    await fetch("addMember/" + grpId + "/" + connection.name);
  };


  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="bg-bg-light  p-2 flex gap-2 rounded-sm items-center"
      key={connection.id}
    >
        {expanded && <ConfirmationBox setExpanded={setExpanded} handleYes={handleAdd} message={"Add "+ connection.name+" to "+grpName}/>}
      <Image
        path={connection.profileImgName}
        fallback={avatar}
        className="rounded-full h-15 w-15"
      />
      <div className="grow text-xl font-semibold">{connection.name}</div>

      {loading ? (
        <img src={rolling} className="h-8" />
      ) : (
        <FaPlus
          onClick={()=>setExpanded(true)}
          className="text-3xl cursor-pointer duration-200 hover:scale-125"
        />
      )}
    
    </div>
  );
}

export default NonMember;
