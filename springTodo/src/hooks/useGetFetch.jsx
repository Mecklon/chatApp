import { useEffect, useRef, useState } from "react"
import api from "../api/api"

const useGetFetch = (initialValue = null)=>{
    const [state,setState] = useState(initialValue)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const controllerRef = useRef()

    const fetch =  async (query, skipAuth = false)=>{
        
        
        if(controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();

        setError(null)
        setLoading(true)
        try{
            const res = await api.get(query, {skipAuth: skipAuth, signal: controllerRef.current.signal})
            setState(res.data)
        }catch(error){
            if(error.response){
                console.log("server error")
                setError(error.response.status+" "+error.response.data.error)
            }else if(error.request){
                console.log("Network error")
                setError(error.request)
            }else{
                console.log("something went wrong")
                setError(error)
            }
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        return ()=>{
            if(controllerRef.current)controllerRef.current.abort()
        }
    },[])

    return {state,setState, error, loading, fetch};
}
export default useGetFetch
