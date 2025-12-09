import { useSearchParams } from "react-router-dom";
import Image from "../hooks/Image";
import { useState } from "react";
import Gallery from "./Gallery";
import Video from "../hooks/Video";
import Audio from "../hooks/Audio";
import File from "../hooks/File";

function Multimedia({ media, preview, scrollBottom }) {
  const [expand, setExpand] = useState(false);
  if (preview) {
    return (
      <div className="flex flex-col gap-2 cursor-pointer">
        {media.map((m) => {
          const type = m.fileType.split("/")[0];
          return type === "image" ? (
            <img
              onLoad={scrollBottom}
              className="w-full rounded"
              key={m.id}
              src={m.frontEndObj}
            />
          ) : type === "video" ? (
            <video
              onLoad={scrollBottom}
              className="w-full rounded"
              key-={m.id}
              src={m.frontEndObj}
            />
          ) : (
            <audio onLoad={scrollBottom} key={m.id} src={m.frontEndObj} />
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
        const type = m.fileType.split("/")[0];
        return type === "image" ? (
          <Image
            onLoadCallBack={scrollBottom}
            className="w-full rounded"
            key={m.id}
            path={m.fileName}
          />
        ) : type === "video" ? (
          <Video
            onLoadedDataCallBack={scrollBottom}
            className="w-full rounded"
            key={m.id}
            path={m.fileName}
          />
        ) : type === "audio" ? (
          <Audio
            onLoadedDataCallBack={scrollBottom}
            className="w-full"
            key={m.id}
            path={m.fileName}
          />
        ) : (
          <File
            path={m.fileName}
            key={m.id}
            fileName={m.fileName}
            fileType={m.fileType}
          />
        );
      })}
      {expand && <Gallery setExpand={setExpand} media={media} />}
    </div>
  );
}

export default Multimedia;
