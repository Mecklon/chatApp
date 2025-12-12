import React, { useEffect, useState, useRef } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import avatar from "../public/avatar.svg";
import Image from "../hooks/Image";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import usePostFetch from "../hooks/usePostFetch";
import rolling from '../assets/rolling.gif'

const ProfileEditor = React.forwardRef((props, ref) => {
  const {
    username,
    email,
    profile,
    setUsername,
    setEmail,
    setProfile,
    caption,
    setCaption,
  } = useAuthContext();

  const [img, setImg] = useState(null);
  const captionRef = useRef();
  const imageRef = useRef();

  const { fetch , loading} = usePostFetch();

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImg(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (imageRef.current.files[0]) {
      formData.append("profile", imageRef.current.files[0]);
    }
    formData.append("caption", captionRef.current.value);
    const res = await fetch("/updateProfile", formData);
    if (res.profile) {
      setProfile(res.profile);
    }
    if (res.caption) {
      setCaption(res.caption);
    }
  };

  const handleCancel = () => {
    if (img) {
      URL.revokeObjectURL(img);
    }
    setImg(null);
    captionRef.current.value = caption;
  };

  useEffect(() => {
    return () => {
      if (img) {
        URL.revokeObjectURL(img);
      }
    };
  }, [img]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-stone-950/75 z-1 flex items-center justify-center ">
      <div
        ref={ref}
        className="rounded-lg bg-background h-full w-full max-h-200 max-w-150 flex flex-col gap-2 justify-start items-center py-10 border border-border text-text"
      >
        <label
          htmlFor="imageInput"
          className="h-[40%] cursor-pointer rounded-full aspect-square overflow-hidden bg-stone-600"
        >
          {img ? (
            <img src={img} className="w-full h-full" />
          ) : (
            <Image path={profile} className="w-full h-full" fallback={avatar} />
          )}
          <input
            id="imageInput"
            onChange={handleChange}
            className="hidden"
            type="file"
            accept="image/*"
            ref={imageRef}
          />
        </label>
        <div className="text-3xl font-bold">{username}</div>
        <div className="text-2xl">{email}</div>
        <textarea
          className="text-2xl cursor-pointer text-primary text-center outline-none resize-none w-[70%] grow mt-4"
          name=""
          ref={captionRef}
          id=""
          placeholder={"describe yourself!!"}
          defaultValue={caption}
        ></textarea>
        <div className="flex gap-1 items-center">
           
          <TiTick
            onClick={handleSubmit}
            className=" text-5xl hover:scale-110 duration-300 cursor-pointer"
          />
          <ImCross
            onClick={handleCancel}
            className=" text-2xl hover:scale-110 duration-300 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
});

export default ProfileEditor;
