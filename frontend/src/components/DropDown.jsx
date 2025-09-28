import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import ProfileEditor from "./ProfileEditor";
const DropDown = React.forwardRef((prop, ref) => {
  const { setUsername, setEmail, setProfile ,setCaption} = useAuthContext();

  const handleLogout = () => {
    localStorage.removeItem("JwtToken");
    setUsername(null);
    setEmail(null);
    setProfile(null);
    setCaption(null);

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
    <div className="absolute w-40 top-full right-0 bg-red-500 " ref={ref}>
      <div className="text-xl p-2 select-none cursor-pointer" onClick={handleLogout}>
        Logout
      </div>
      <div ref={triggerRef} className="text-xl p-2 select-none cursor-pointer" onClick={()=>setOpenProfileDetails(true)}>Profile Details</div>
      {
        openProfileDetails &&
        
        <ProfileEditor ref={focusRef}/>
      }
    </div>
  );
});

export default DropDown;
