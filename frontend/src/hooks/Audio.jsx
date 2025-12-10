import { useEffect, useState } from "react";
import api from "../api/api";

const Audio = ({
  path = null,
  className = "",
  fallback = null,
  controls = true,
  autoPlay = false,
  loop = false,
  onLoadedDataCallBack,
  
}) => {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!path) return;

    let objectUrl;

    const loadAudio = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/files/${path}`, { responseType: "blob" });

        objectUrl = URL.createObjectURL(res.data);
        setSrc(objectUrl);
      } catch (err) {
        console.error("Audio fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAudio();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  if (loading) return <div>Loading audio...</div>;
  if (!src && fallback) return fallback;

  return (
    <audio
      src={src}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      onLoadedData={() => {
        if (onLoadedDataCallBack) onLoadedDataCallBack();
      }}
      
    />
  );
};

export default Audio;
