import React, { useEffect } from "react";
import Contacts from "./Contacts";
import Header from "./Header";
import Chat from "./Chat";
import { useDispatch, useSelector } from "react-redux";
import { getConnections, getGroups } from "../store/slices/connectionsSlice";
import { getRequests } from "../store/slices/connectionsSlice";
import { getNotifications } from "../store/slices/notificationsSlice";
import useGetFetch from "../hooks/useGetFetch";
import InfoTab from "./InfoTab";
function Home() {
  const dispatch = useDispatch();
  const { fetch } = useGetFetch();
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    dispatch(getConnections());
    dispatch(getGroups());
    dispatch(getRequests(tomorrow.toISOString().slice(0, 23)));
    dispatch(getNotifications(tomorrow.toISOString().slice(0, 23)));
    fetch("/receivedMessages");
  }, []);

  const { expanded } = useSelector((store) => store.tile);

  return (
    <div
      className={`px-30 bg-amber-300 w-full h-full grid p-1 grid-cols-[370px_1fr_370px] grid-rows-[60px_1fr] gap-1 ${
        expanded
          ? '[grid-template-areas:"header_header_header""sideBar_main_info"]'
          : '[grid-template-areas:"header_header_header""sideBar_main_main"]'
      }`}
    >
      <Header />

      <Contacts />
      <Chat />
      {expanded && <InfoTab />}
    </div>
  );
}

export default Home;
