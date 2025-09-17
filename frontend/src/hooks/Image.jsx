import { useEffect, useState } from "react";
import api from "../api/api";

const Image = ({ path, className = "" }) => {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await api.get(`http://localhost:9090/api/files/${path}`, {
          responseType: "blob",
        });
        const objectUrl = URL.createObjectURL(res.data);
        setSrc(objectUrl);
      } catch (err) {
        console.log("image fetch err: ", err);
      }
    };

    getData();
    return () => {
      URL.revokeObjectURL(URL.createObjectURL(res.data));
    };
  }, [path]);

  if (!src) {
    return <div>Loading.....</div>;
  }
  return <img src={src} className={className} alt="" />;
};
export default Image;
