import React, { useState } from "react";
import Image from "../hooks/Image";
import Video from "../hooks/Video";
import { LuAudioLines } from "react-icons/lu";
import Audio from "../hooks/Audio";
import { FaMusic } from "react-icons/fa6";

function ExpandableMedia({ media }) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (media.fileName.startsWith("audio")) return;
    setExpanded(!expanded);
  };

  return (
    <div
      className={` aspect-square bg-black/75 flex items-center justify-center cursor-pointer overflow-auto ${
        expanded && "fixed top-0 h-[100vh] right-0 w-[100vw] z-10"
      }`}
      onClick={handleClick}
    >
      {media.fileType.startsWith("video") ? (
        <Video
          path={media.fileName}
          className={`${!expanded ? "h-full w-full object-cover" : "w-[80%]"}`}
          controls={expanded}
          onClickCallBack={expanded ? (e) => e.stopPropagation() : null}
          key={media.id}
        />
      ) : media.fileType.startsWith("image") ? (
        <Image
          key={media.id}
          path={media.fileName}
          className={`${!expanded ? "h-full w-full object-cover" : "w-[80%]"}`}
        />
      ) : (
        <div key={media.id} onClick={(e) => e.stopPropagation()}>
          {!expanded && <FaMusic className="text-4xl text-white"/>}

          <Audio
            key={media.id}
            path={media.fileName}
            className={`${!expanded ? "h-0 w-0" : "[width:60vw] "}`}
          />
        </div>
      )}
    </div>
  );
}

export default ExpandableMedia;
