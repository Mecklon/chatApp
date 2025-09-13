import { useEffect, useState } from "react"

const useDebounce = (initial,delay=1000)=>{
    const [state, setState] = useState(initial)

    useEffect(()=>{

        if(!state) return;

        const timeout = setTimeout(() => {
            setState(initial)
        }, delay);

        return ()=>{
            clearTimeout(timeout)
        }
    },[state,initial, delay])

    return [state, setState]
}

export default useDebounce