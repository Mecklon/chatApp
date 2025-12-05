import React, { useEffect } from "react";
import Contacts from "./Contacts";
import Header from "./Header";
import Chat from "./Chat";
import { useDispatch, useSelector } from "react-redux";
import { getConnections, getGroups } from "../store/slices/connectionsSlice";
import { getRequests } from "../store/slices/connectionsSlice";
import { getNotifications } from "../store/slices/notificationsSlice";

function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    dispatch(getConnections());
    dispatch(getGroups())
    dispatch(getRequests(tomorrow.toISOString().slice(0, 23)));
    dispatch(getNotifications(tomorrow.toISOString().slice(0, 23)));
    fetch("/receivedMessages");

    console.log("aldfa;lfdj")
  }, []);

  


  return (
    <div
      className='px-30 bg-amber-300 w-full h-screen grid p-1 grid-cols-[370px_1fr_370px] grid-rows-[60px_1fr] gap-1 [grid-template-areas:"header_header_header""sideBar_main_info"]
    '
    >
      <Header />

      <Contacts />
      <Chat />
      <div className="bg-amber-950 [grid-area:info]"></div>
    </div>
  );
}

export default Home;
