import { createContext, useEffect, useState } from "react";
import api from "../api/api";
export const AuthContext = createContext();


const AuthContextProvider = ({children})=>{
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [profile, setProfile] = useState(null);
    const [caption, setCaption] = useState(null);
    const [unseenNotifications, setUnseenNotifications] = useState(0);
    const [unseenRequests, setUnseenRequests] = useState(0);


    useEffect(()=>{
        const autoLogin = async ()=>{
            const res = await api.get("http://localhost:9090/autoLogin")
            setUsername(res.data.username);
            setEmail(res.data.email)
            setUnseenNotifications(parseInt(res.data.unseenNotifications))
            setUnseenRequests(parseInt(res.data.unseenRequests))
            if(res.data.profile){
                setProfile(res.data.profile)
            }
            setCaption(res.data.caption)
        }
        autoLogin()
    },[])


    return <AuthContext.Provider value={{username, setUsername, email, setEmail, profile,setProfile,caption, setCaption,unseenNotifications, setUnseenNotifications, setUnseenRequests, unseenRequests}}>
        {children}
    </AuthContext.Provider>
}

export default AuthContextProvider;