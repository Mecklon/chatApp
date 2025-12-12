import React, { forwardRef, useEffect, useRef } from "react";
import Notification from "./Notification";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../store/slices/notificationsSlice";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffectEvent } from "react";
import useGetFetch from "../hooks/useGetFetch";
const Notifications = forwardRef(({ state }, ref) => {
  const { notifications, hasMore, loading } = useSelector(
    (state) => state.notification
  );
  const {fetch} = useGetFetch()
  const dispatch = useDispatch();

  const endRef = useRef();

  const {unseenNotifications, setUnseenNotifications} = useAuthContext();

  useEffect(()=>{
    return ()=>{
      if(unseenNotifications===0)return
      fetch("setNotificationSeen")
      setUnseenNotifications(()=>0)
    }
  },[])

  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (
        !entry.isIntersecting ||
        loading ||
        notifications.length === 0 ||
        !hasMore
      )
        return;
      dispatch(
        getNotifications(notifications[notifications.length - 1].postedOn)
      );
    });

    if (endRef.current) {
      observer.observe(endRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading, notifications, hasMore]);

  return (
    <div
      ref={ref}
      className="top-full bg-bg-dark rounded-xl border text-text border-border absolute w-[500px] -translate-x-1/2 [max-height:700px] overflow-auto customScroll"
    >
      {notifications.map(notification=>{
        return < Notification key={notification.id} notification={notification}/>
      })}

      {hasMore && <div ref={endRef}>Loading...</div>}
    </div>
  );
});

export default Notifications;
