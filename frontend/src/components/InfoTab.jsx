import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { setExpanded } from "../store/slices/TileSlice";
import avatar from "../assets/defaultAvatar.webp";
import useGetFetch from "../hooks/useGetFetch";
import Image from "../hooks/Image";
import { useEffect, useState } from "react";
import VisualMedia from "./VisualMedia";
import File from "../hooks/File";
import GroupInfoTab from "./GroupInfoTab";

import ConnectionInfoTab from "./ConnectionInfoTab";

function InfoTab() {
  const { isPrivate } = useSelector((store) => store.chat);

  if (isPrivate) {
    return <ConnectionInfoTab />;
  }

  return <GroupInfoTab />;
}

export default InfoTab;
