import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { setExpanded } from "../store/slices/TileSlice";
import avatar from "../assets/defaultAvatar.webp";
import useGetFetch from "../hooks/useGetFetch";
import Image from "../hooks/Image";
import { useEffect, useState } from "react";
import VisualMedia from "./VisualMedia";
import File from "../hooks/File";


function ConnectionInfoTab() {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((store) => store.chat);

  const { fetch } = useGetFetch();

  const [caption, setCaption] = useState(null);

  const [visualMedia, setVisualMedia] = useState([]);
  const [documentMedia, setDocumentMedia] = useState([]);

  useEffect(() => {
    if (!userInfo.name) return;
    const getInfoData = async () => {
      let data = await fetch("getUserData/" + userInfo.name);
      setCaption(data.caption);

      data = await fetch("getVisualMedia/" + userInfo.name + "/" + -1);
      setVisualMedia(data);

      data = await fetch("getDocumentMedia/" + userInfo.name + "/" + -1);
      setDocumentMedia(data);
    };

    getInfoData();
  }, [userInfo.name]);

  const [visual, setVisual] = useState(true);

  return (
    <div className="bg-amber-950 [grid-area:info] p-3 relative flex flex-col min-h-0">
      <RxCross1
        className="absolute right-3"
        onClick={() => dispatch(setExpanded(false))}
      />

      <Image
        path={userInfo.profileImgName}
        fallback={avatar}
        className="mx-auto rounded-full mt-4 w-[40%] aspect-square"
      />
      <div className="text-center font-bold text-2xl">{userInfo.name}</div>
      <div className="text-center">{caption}</div>
      <div className="flex mt-2">
        <div
          onClick={() => setVisual(true)}
          className={`${
            visual && "customBorder"
          } grow text-center p-2 text-2xl cursor-pointer`}
        >
          Visual Media
        </div>
        <div
          onClick={() => setVisual(false)}
          className={`${
            !visual && "customBorder"
          } grow text-center p-2 text-2xl cursor-pointer`}
        >
          Document
        </div>
      </div>
      {visual && (
        <div className="grid grid-cols-3 w-full h-full overflow-auto customScroll content-start">
          <VisualMedia mediaList={visualMedia} />
       
       
          
        </div>
      )}
      {!visual && (
        <div className="flex flex-col gap-2 overflow-auto customScroll">
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

export default ConnectionInfoTab;