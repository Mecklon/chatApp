import React, { forwardRef, useEffect, useRef } from "react";
import Request from "./Request";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDispatch, useSelector } from "react-redux";
import { getRequests } from "../store/slices/connectionsSlice";
import useGetFetch from "../hooks/useGetFetch";
const Requests = forwardRef(({ state }, ref) => {
  const { unseenRequests, setUnseenRequests } = useAuthContext();


  const { requests, requestsFetchStatus, hasMoreRequests } = useSelector(
    (store) => store.connection
  );

  const {fetch} = useGetFetch()

  useEffect(()=>{
    return ()=>{
      if(setUnseenRequests===0)return
      fetch("/setRequestSeen")
      setUnseenRequests(()=>0)
    }
    
  },[])
 
  const dispatch = useDispatch();

  const endRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (
        !entry.isIntersecting ||
        !hasMoreRequests ||
        requestsFetchStatus ||
        requests.length == 0
      )
        return;

      dispatch(getRequests(requests[requests.length - 1].postedOn));
    });

    if (endRef.current) {
      observer.observe(endRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [hasMoreRequests, requestsFetchStatus, requests]);

  return (
    <div
      ref={ref}
      className="w-[400px] h-max-[600px] bg-stone-700 absolute top-full right-0 overflow-auto customScroll"
    >
      {
        requests.map(request=>{
          return <Request key={request.id} request = {request}/>
        })
      }
      {hasMoreRequests && <div ref={endRef}>Loading...</div>}
    </div>
  );
});

export default Requests;
