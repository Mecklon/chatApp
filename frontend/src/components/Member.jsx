import React, { useEffect, useReducer, useRef, useState } from "react";
import Image from "../hooks/Image";
import avatar from "../assets/defaultAvatar.webp";
import { TbDotsVertical } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "../hooks/useAuthContext";
import { setFriendRoom } from "../store/slices/chatSlice";
import { setExpanded } from "../store/slices/TileSlice";
import ConfirmationBox from "./ConfirmationBox";
import useGetFetch from "../hooks/useGetFetch";

function Member({
  member,
  isAdmin,
  index,
  setActiveMenuIndex,
  openMenu,
  setMembers,
}) {
  const { connectionSet } = useSelector((store) => store.connection);
  const {grpInfo} = useSelector(store=>store.chat)

  const connectionSetRef = useRef(new Set());

  const dispatch = useDispatch();

  useEffect(() => {
    connectionSet.forEach((connection) => {
      connectionSetRef.current.add(connection);
    });
  }, [connectionSet]);

  const {fetch} = useGetFetch()

  const handleYes = async() => {
    setActiveMenuIndex(-1);
    setMembers((members) => {
      return members.filter((m) => m.username !== member.username);
    });
    await fetch("/KickMember/"+member.username+"/"+grpInfo.id);
  };

  const { username } = useAuthContext();

  const [confirmation, setConfirmation] = useState(false);
  return (
    <div
      className={`bg-bg-light p-2 flex gap-2 rounded-sm items-center relative ${
        openMenu && "z-10"
      }`}
    >
      <Image
        path={member.profileImgName}
        fallback={avatar}
        className="rounded-full h-15 w-15"
      />
      <div className="grow text-xl font-semibold ">
        {member.username}
        {member.admin && (
          <>
            <br />
            <div className="bg-green-950 inline text-green-500 p-1 rounded-sm text-xs ">
              Group Admin
            </div>
          </>
        )}
        {username === member.username && (
          <div className="inline ml-1 text-white p-1 rounded-sm text-xs bg-blue-950">
            You
          </div>
        )}
      </div>
      {username !== member.username && (
        <div
          className="p-2 rounded-full aspect-square duration-200 cursor-pointer hover:bg-black/60"
          onClick={(e) => {
            e.stopPropagation();
            setActiveMenuIndex((prev) => {
              return prev === -1 ? index : -1;
            });
          }}
        >
          <TbDotsVertical className="text-2xl" />
        </div>
      )}
      {openMenu && (
        <div className="bg-bg-dark text-text border border-border userGroupMenu absolute right-0 top-[70%] rounded-sm">
          {isAdmin && !member.admin && (
            <div
              className="p-1  px-3  cursor-pointer hover:bg-bg"
              onClick={() => setConfirmation(true)}
            >
              Kick member
            </div>
          )}
          {connectionSetRef.current.has(member.username) ? (
            <div
              className="p-1 px-3 cursor-pointer hover:bg-bg"
              onClick={() => {
                dispatch(setFriendRoom(member.username));
                dispatch(setExpanded(false));
              }}
            >
              Message
            </div>
          ) : (
            <div className="p-1 px-3 cursor-pointer hover:bg-bg">
              Send Friend Request
            </div>
          )}
        </div>
      )}
      {confirmation && (
        <ConfirmationBox message={"Kick "+member.username+" out of "+grpInfo.name} setExpanded={setConfirmation} handleYes={handleYes} />
      )}
    </div>
  );
}

export default Member;
