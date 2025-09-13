import { createContext, useEffect, useState } from "react";
import api from "../api/api";
export const AuthContext = createContext();

const AuthContextProvider = ({children})=>{
    const [username, setUsername] = useState(null);

    useEffect(()=>{
        const autoLogin = async ()=>{
            const res = await api.get("http://localhost:9090/autoLogin")
            setUsername(res.data.username);

        }
        autoLogin()
    },[])

    return <AuthContext.Provider value={{username, setUsername}}>
        {children}
    </AuthContext.Provider>
}

export default AuthContextProvider;