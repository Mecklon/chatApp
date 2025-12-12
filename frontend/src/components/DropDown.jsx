import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import ProfileEditor from "./ProfileEditor";
import api from "../api/api";
import { useDispatch } from "react-redux";
import { clearConnections } from "../store/slices/connectionsSlice";
import { clearChats } from "../store/slices/chatSlice";
import { clearNotification } from "../store/slices/notificationsSlice";
import { setExpanded } from "../store/slices/TileSlice";
const DropDown = React.forwardRef((prop, ref) => {
  const { setUsername, setEmail, setProfile ,setCaption} = useAuthContext();

  const dispatch = useDispatch()

  const handleLogout = async() => {
    localStorage.removeItem("JwtToken");
    setUsername(null);
    setEmail(null);
    setProfile(null);
    setCaption(null);
    dispatch(clearConnections())
    dispatch(clearChats())
    dispatch(clearNotification())
    dispatch(setExpanded(false))
    await api.get('/logout')
  };

  const focusRef = useRef();
  const triggerRef = useRef()
  const [openProfileDetails, setOpenProfileDetails] = useState(false)
  useEffect(()=>{
    const handleFocus = (event)=>{
        if(focusRef.current && !focusRef.current.contains(event.target) && triggerRef.current && !triggerRef.current.contains(event.target) ){
            setOpenProfileDetails(false)
        }
    }

    window.addEventListener("click",handleFocus)

    return ()=>{
        window.removeEventListener("click",handleFocus)
    }
  },[])


  return (
    <div className="absolute w-40 top-full right-0 border bg-bg-dark border-border rounded-lg text-text " ref={ref}>
      <div className="text-xl hover:bg-bg-light p-2 select-none cursor-pointer" onClick={handleLogout}>
        Logout
      </div>
      <div ref={triggerRef} className="text-xl p-2 hover:bg-bg-light select-none cursor-pointer" onClick={()=>setOpenProfileDetails(true)}>Profile Details</div>
      {
        openProfileDetails &&
        
        <ProfileEditor  ref={focusRef}/>
      }
    </div>
  );
});

export default DropDown;
