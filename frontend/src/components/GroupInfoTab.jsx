import React, { useRef } from "react";
import defaultGroupAvatar from "../assets/defaultGroupAvatar.jpg";

import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { setExpanded } from "../store/slices/TileSlice";
import avatar from "../assets/defaultAvatar.webp";
import useGetFetch from "../hooks/useGetFetch";
import Image from "../hooks/Image";
import { useEffect, useState } from "react";
import VisualMedia from "./VisualMedia";
import File from "../hooks/File";
import Member from "./Member";

function GroupInfoTab() {
  const dispatch = useDispatch();

  const { grpInfo } = useSelector((store) => store.chat);

  const { fetch } = useGetFetch();

  const [caption, setCaption] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [visualMedia, setVisualMedia] = useState([]);
  const [documentMedia, setDocumentMedia] = useState([]);
  const [members, setMembers] = useState([]);

  const [activeMenuIndex, setActiveMenuIndex] = useState(-1);

  useEffect(() => {
    const handleMenuToggle = (e) => {
      const menu = document.querySelector(".userGroupMenu");
      if (menu && menu.contains(e.target)) return;

      setActiveMenuIndex(-1);
    };

    document.addEventListener("click", handleMenuToggle);

    return () => {
      document.removeEventListener("click", handleMenuToggle);
    };
  }, []);

  useEffect(() => {
    if (!grpInfo.id) return;
    const getInfoData = async () => {
      let data = await fetch("getGroupData/" + grpInfo.id);
      setCaption(data.caption);
      setIsAdmin(data.admin);

      data = await fetch("getGroupVisualMedia/" + grpInfo.id + "/" + -1);
      setVisualMedia(data);

      data = await fetch("getGroupDocumentMedia/" + grpInfo.id + "/" + -1);
      setDocumentMedia(data);

      data = await fetch("getMembers/" + grpInfo.id);
      setMembers(data);
    };

    getInfoData();
  }, [grpInfo.id]);
  

  const memberSet = useRef(new Set());
  useEffect(() => {
    members.forEach((member) => memberSet.current.add(member.username));
  }, [members]);


  

  const [tab, setTab] = useState(1);

  return (
    <div className="bg-amber-950 [grid-area:info] p-3 relative flex flex-col min-h-0">
      <RxCross1
        className="absolute right-3"
        onClick={() => dispatch(setExpanded(false))}
      />
   
      <Image
        path={grpInfo.profileImgName}
        fallback={avatar}
        className="mx-auto rounded-full mt-4 w-[40%] aspect-square"
      />
      <div className="text-center font-bold text-2xl">{grpInfo.name}</div>
      <div className="text-center">{caption}</div>

      <div className="flex mt-4">
        <div
          onClick={() => setTab(1)}
          className={`${
            tab === 1 && "customBorder"
          } grow text-center p-2 text-xl cursor-pointer`}
        >
          Members
        </div>
        <div
          onClick={() => setTab(2)}
          className={`${
            tab === 2 && "customBorder"
          } grow text-center p-2 text-xl cursor-pointer`}
        >
          Visual Media
        </div>
        <div
          onClick={() => setTab(3)}
          className={`${
            tab === 3 && "customBorder"
          } grow text-center p-2 text-xl cursor-pointer`}
        >
          Document
        </div>
      </div>
      {tab === 1 && (
        <div className="flex flex-col grow gap-2 min-h-0 overflow-auto customScroll">
          {members.map((member,index) => (
            <Member key={index} index={index} member={member} isAdmin={isAdmin} setMembers={setMembers} setActiveMenuIndex={setActiveMenuIndex} openMenu={activeMenuIndex === index}/>
          ))}
        </div>
      )}
      {tab === 2 && (
        <div className="grid grid-cols-3 w-full overflow-auto customScroll">
          <VisualMedia mediaList={visualMedia} />
        </div>
      )}
      {tab === 3 && (
        <div className="flex flex-col gap-2 overflow-auto customScroll min-h-0">
          {documentMedia.map((document) => (
            <File
              path={document.fileName}
              key={document.id}
              fileName={document.fileName}
              fileType={document.fileType}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupInfoTab;
