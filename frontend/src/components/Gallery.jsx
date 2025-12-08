import React from "react";
import Image from "../hooks/Image";
import Video from "../hooks/Video";
function Gallery({ setExpand, media }) {
  return (
    <div
      onClickCapture={(e) => {
        e.stopPropagation();
        setExpand(false);
      }}
      className="fixed bg-[rgba(0,0,0,0.9)] inset-0 z-10 flex items-center overflow-auto customScroll"
      onClick={() => setExpand(false)}
    >
      {media.map((m) => {
        return (
          <div className="h-full w-full flex items-center justify-center shrink-0">
            {m.fileType.split("/")[0]=="image" ?
            <Image path={m.fileName} key={m.id} className="h-[90%]"/>:
            <Video path={m.fileName} key={m.id} className="h-[90%]"/>
        }
          </div>
        );
      })}
    </div>
  );
}

export default Gallery;
