import React, { useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { GoPeople } from "react-icons/go";
import noImage from "../assets/imagePlaceholder.svg";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import usePostFetch from "../hooks/usePostFetch";
import { useAuthContext } from "../hooks/useAuthContext";
import CreateGroupFormFriend from "./CreateGroupFormFriend";
import rolling from "../assets/rolling.gif";
import { addGroup } from "../store/slices/connectionsSlice";
import { motion } from "motion/react";

function CreateGroupForm({ setIsOpen }) {
  const [profile, setProfile] = useState(null);

  const { connections } = useSelector((store) => store.connection);

  const [prefix, setPrefix] = useState("");

  const handleType = (e) => {
    setPrefix(e.target.value);
  };

  const { username } = useAuthContext();
  const [members, setMembers] = useState(new Set([username]));
  const [admins, setAdmins] = useState(new Set([username]));

  const dispatch = useDispatch();

  const handleFileInput = (e) => {
    if (profile) {
      URL.revokeObjectURL(profile);
    }
    setProfile(URL.createObjectURL(e.target.files[0]));
  };

  const cancelImage = () => {
    if (profile) {
      URL.revokeObjectURL(profile);
      setProfile(null);
    }
  };

  const { error, loading, fetch } = usePostFetch();

  const handleSubmit = async () => {
    let error1 = document.querySelector("#error1");
    let error2 = document.querySelector("#error2");
    let error3 = document.querySelector("#error3");
    error1.classList.add("hidden");
    error2.classList.add("hidden");
    error3.classList.add("hidden");

    if (document.querySelector("#name").value.trim() === "") {
      error1.classList.remove("hidden");
    }

    if (document.querySelector("#caption").value.trim() === "") {
      error2.classList.remove("hidden");
    }
    if (members.size === 1) {
      error3.classList.remove("hidden");
    }

    if (
      document.querySelector("#name").value.trim() === "" ||
      document.querySelector("#caption").value.trim() === "" ||
      members.size === 1
    ) {
      return;
    }

    let formData = new FormData();
    formData.append("title", document.querySelector("#name").value.trim());
    formData.append("caption", document.querySelector("#caption").value.trim());
    if (document.querySelector("#image").files.length != 0) {
      formData.append("profile", document.querySelector("#image").files[0]);
    }
    [...members].forEach((member) => formData.append("members", member));
    [...admins].forEach((admin) => formData.append("admins", admin));

    const newGroup = await fetch("/createGroup", formData);
    dispatch(addGroup(newGroup));
    setIsOpen(false);
  };

  return (
    <div className="absolute inset-0 z-10  backdrop-blur-2xl flex justify-center items-center ">
      <motion.div
        initial={{ opacity: 0, translateY: 100 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          duration: 0.1,
        }}
        onClick={(e) => e.stopPropagation()}
        className="bg-bg text-text border-border border h-[920px] w-[650px] rounded-2xl py-3 px-8"
      >
        <div
          onClick={() => setIsOpen(false)}
          className="flex justify-end text-2xl  "
        >
          <RxCross2
            className="hover:scale-125
        duration-200 text-text"
          />
        </div>
        <div className="flex gap-4 items-center">
          <GoPeople className="text-4xl text-secondary" />
          <div className="text-2xl font-bold">Create New Group</div>
        </div>
        <div className=" text-lg">
          Set up your group chat with a title, description and members.
        </div>
        <hr className="bg-border border-0 h-[1px] my-2 mb-6" />
        <label htmlFor="name" className="font-medium flex gap-6 items-center">
          Group Name*
          <div id="error1" className="text-sm text-red-600 hidden">
            Enter the name of the group
          </div>
        </label>
        <input
          type="text"
          id="name"
          className=" block mt-2 mb-4 w-full rounded-lg text-[1rem] py-2  px-4 outline-1 outline-border focus:outline-secondary duration-75 invalid:bg-amber-400-"
        />
        <label
          htmlFor="caption"
          className="font-medium flex gap-6 items-center"
        >
          Group Caption*
          <div id="error2" className="text-sm text-red-600 hidden">
            Enter a caption for the group
          </div>
        </label>
        <textarea
          type="text"
          id="caption"
          rows="4"
          className=" block mt-2 mb-4 w-full rounded-lg text-[1rem] py-2  px-4 outline-1 outline-border focus:outline-secondary  duration-75 resize-none"
        ></textarea>
        <div className="font-medium">Group Image (Optional)</div>
        <div className="flex gap-4 items-center mt-3 mb-6  ">
          <div className="relative">
            {profile && (
              <div
                onClick={cancelImage}
                className="absolute right-0 flex items-center justify-center p-1 rounded-full bg-red-600  hover:scale-110 duration-300"
              >
                <RxCross2 className="text-white" />
              </div>
            )}
            <img
              src={profile ? profile : noImage}
              alt=""
              id="img"
              className="bg-secondary border-1 rounded-[100%] border-border h-20 w-20"
            />
          </div>
          <label
            htmlFor="image"
            className="py-2 px-4 rounded border-1 border-border hover:bg-secondary hover:border-secondary hover:text-white duration-300 cursor-pointer"
          >
            Upload Image
          </label>
          <input
            onChange={handleFileInput}
            type="file"
            id="image"
            accept="*/image"
            className="hidden"
          />
        </div>
        <div className="flex justify-between">
          <div className="font-medium flex gap-6 items-center">
            Add Members({members.size})
            <div id="error3" className="text-sm text-red-600 hidden">
              Select atleast one more member
            </div>
          </div>
          <div className="text-sm"> {admins.size} admins</div>
        </div>

        <label
          htmlFor="search"
          onChange={handleType}
          className="flex gap-2 p-3 focus-within:border-secondary rounded-xl border-1 border-border items-center my-2"
        >
          <HiMagnifyingGlass className="text-lg text-text" />
          <input
            type="text"
            id="search"
            className="outline-none grow"
            placeholder="Search Friends"
          />
        </label>
        <div className="p-1 rounded-xl border-1 h-[200px] overflow-auto customScroll thinTrack  border-border flex flex-col gap-1">
          {connections.map((connection) => {
            return (
              connection.name.toLowerCase().includes(prefix.toLowerCase()) && (
                <CreateGroupFormFriend
                  setAdmins={setAdmins}
                  setMembers={setMembers}
                  members={members}
                  admins={admins}
                  key={connection.id}
                  connection={connection}
                />
              )
            );
          })}
        </div>
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="w-full cursor-pointer hover:scale-101
        mt-3 duration-100 active:scale-99 bg-secondary text-white text-center text-lg p-3 rounded-2xl flex gap-3 justify-center items-center"
        >
          Create Group
          {loading && <img src={rolling} alt="" className="h-7 scale-145" />}
        </button>
      </motion.div>
    </div>
  );
}

export default CreateGroupForm;
