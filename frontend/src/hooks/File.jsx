import { useEffect, useState } from "react";
import api from "../api/api";
import { FaDownload } from "react-icons/fa6";
import excel from "../assets/excel.png";
import word from "../assets/word.png";
import ppt from "../assets/powerpoint.png";
import pdf from "../assets/pdf.png";

const File = ({ path = null, fileName = "file", fileType = null }) => {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!path) return;

    let objectUrl;

    const loadFile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/files/${path}`, {
          responseType: "blob",
        });

        const mimeType =
          fileType || res.data.type || "application/octet-stream";
        objectUrl = URL.createObjectURL(
          new Blob([res.data], { type: mimeType })
        );

        setSrc(objectUrl);
      } catch (err) {
        console.error("file fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFile();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path, fileType]);

  if (loading) return <div>Loading file...</div>;
  if (!src) return <div>Failed to load file</div>;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="text-sm flex gap-2 text-text bg-bg-light p-2 rounded-sm items-center cursor-auto"
    >
      <div className=" rounded-full h-17 w-17 shrink-0 p-3">
        {fileType === "application/pdf" ? (
          <img src={pdf} className="h-full" />
        ) : fileType === "text/plain" ? (
          <img src={word} className="h-full" />
        ) : fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? (
          <img className="h-full" src={excel} />
        ) : (
          <img className="h-full" src={ppt} />
        )}
      </div>
      <div className="grow break-all">Download {fileName}</div>
      <a  href={src} download={fileName} id={`link-${fileName}`}>
        <div
          htmlFor={`link-${fileName}`}
          className="hover:bg-[rgba(0,0,0,0.5)] duration-200 cursor-pointer p-4 rounded-full shrink-0"
        >
          <FaDownload className="text-2xl" />
        </div>
      </a>
    </div>
  );
};

export default File;
