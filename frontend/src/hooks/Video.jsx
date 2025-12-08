import { useEffect, useState } from "react";
import api from "../api/api";

const Video = ({
  path = null,
  className = "",
  fallback = null,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  onLoadedDataCallBack,
}) => {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!path) return;

    let objectUrl;

    const loadVideo = async () => {
      try {
        setLoading(true);
        const res = await api.get(`http://localhost:9090/api/files/${path}`, {
          responseType: "blob",
        });

        objectUrl = URL.createObjectURL(res.data);
        setSrc(objectUrl);
      } catch (err) {
        console.log("video fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  if (loading) {
    return <div>Loading video...</div>;
  }

  if (!src && fallback) {
    return fallback;
  }

  return (
    <video
      onLoadedData={() => {
        console.log("data loaded")
        if (onLoadedDataCallBack) {
          onLoadedDataCallBack();
        }
      }}
      src={src}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      // make sure to remove in setup
      controlsList="nofullscreen"
    />
  );
};

export default Video;
