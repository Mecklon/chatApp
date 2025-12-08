import { useSearchParams } from "react-router-dom";
import Image from "../hooks/Image";
import { useState } from "react";
import Gallery from "./Gallery";
import Video from "../hooks/Video";

function Multimedia({ media, preview, scrollBottom }) {
  const [expand, setExpand] = useState(false);
  if (preview) {
    return (
      <div className="flex flex-col gap-2 cursor-pointer">
        {media.map((m) => {
          return m.fileType.split("/")[0] === "image" ? (
            <img  onLoad={scrollBottom} className="w-full rounded" key={m.id} src={m.frontEndObj} />
          ) : (
            <video onLoad={scrollBottom} className="w-full rounded" key-={m.id} src={m.frontEndObj} />
          );
        })}
      </div>
    );
  }

  return (
    <div
      onClick={() => setExpand(true)}
      className="flex flex-col gap-2 cursor-pointer"
    >
      {media.map((m) => {
        return (
          m.fileType.split("/")[0] === "image"?
          <Image onLoadCallBack={scrollBottom} className="w-full rounded" key={m.id} path={m.fileName} />:
          <Video onLoadedDataCallBack={scrollBottom} className="w-full rounded" key={m.id} path={m.fileName}/>
        );
      })}
      {expand && <Gallery setExpand={setExpand} media={media} />}
    </div>
  );
}

export default Multimedia;
