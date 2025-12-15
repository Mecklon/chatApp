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
import { motion } from "motion/react";
import usePostFetch from "../hooks/usePostFetch";
import { MdBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import ConfirmationBox from "./ConfirmationBox";
import { addMessage, updateBlockedChat } from "../store/slices/chatSlice";
import { useAuthContext } from "../hooks/useAuthContext";
import { updateBlockedContact } from "../store/slices/connectionsSlice";

function ConnectionInfoTab() {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((store) => store.chat);

  const { fetch } = useGetFetch();
  const { fetch: postFetch } = usePostFetch();

  const [caption, setCaption] = useState(null);

  const [expanded, setExpanded2] = useState(false);

  const [visualMedia, setVisualMedia] = useState([]);
  const [documentMedia, setDocumentMedia] = useState([]);

  const { username } = useAuthContext();

  console.log(expanded ,userInfo.blocked  )
  console.log(expanded , userInfo.blocked != username , !userInfo.blocked)
  console.log(expanded && userInfo.blocked != username && userInfo.blocked )

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
    <motion.div
      className="bg-bg border border-border text-text rounded-xl [grid-area:info] p-3 relative flex flex-col min-h-0"
      initial={{ translateX: 600 }}
      animate={{ translateX: 0 }}
      transition={{ translateX: { bounce: 0 } }}
    >
      <RxCross1
        className="absolute right-3 cursor-pointer text-text duration-300 hover:scale-125"
        onClick={() => {console.log("alsfja;");dispatch(setExpanded(false))}}
      />

      {userInfo.blocked != username && !userInfo.blocked && (
        <div
          className="absolute left-1 flex gap-1/2 items-center text-rose-600 p-1 px-2 duration-300 hover:bg-bg-light cursor-pointer top-1 rounded-sm"
          onClick={() => setExpanded2(true)}
        >
          <MdBlock className="text-xl" />
          block
        </div>
      )}
      {expanded && userInfo.blocked != username && !userInfo.blocked && (
        <ConfirmationBox
          setExpanded={setExpanded2}
          handleYes={async () => {
            const message = await postFetch("blockUser/" + userInfo.name);
            dispatch(addMessage(message));
            dispatch(updateBlockedChat({sender: userInfo.name, receiver: userInfo.name}))
            dispatch(updateBlockedContact({sender: userInfo.name, receiver: userInfo.name}))
          }}
          message={"Block " + userInfo.name + " ?"}
        />
      )}

      {userInfo.blocked != username && userInfo.blocked && (
        <div
          className="absolute left-1 flex gap-1/2 items-center text-green-600 p-1 px-2 duration-300 hover:bg-bg-light cursor-pointer top-1 rounded-sm"
          onClick={()=>setExpanded2(true)}
        >
          <CgUnblock className="text-xl" />
          unblock
        </div>
      )}

      {expanded && userInfo.blocked != username && userInfo.blocked && (
        <ConfirmationBox
          setExpanded={setExpanded2}
          handleYes={async () => {
            const message = await postFetch("unblockUser/" + userInfo.name);
            dispatch(addMessage(message));
            dispatch(updateBlockedChat({sender: userInfo.name, receiver: null}))
            dispatch(updateBlockedContact({sender: userInfo.name, receiver: null}))
          }}
          message={"Unblock " + userInfo.name + " ?"}
        />
      )}

      <Image
        path={userInfo.profileImgName}
        fallback={avatar}
        className="mx-auto rounded-full mt-4 w-[40%] aspect-square"
      />
      <div className="text-center font-bold text-2xl">{userInfo.name}</div>
      <div className="text-center">{caption}</div>
      <div className="flex mt-3">
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
    </motion.div>
  );
}

export default ConnectionInfoTab;
