import React, {
  forwardRef,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "../hooks/Image";
import Person from "./Person";

import useGetFetch from "../hooks/useGetFetch";
import { useSelector } from "react-redux";


const People = forwardRef(({ searchList, setSearchList }, ref) => {
  const [hasMore, setHasMore] = useState(true);
  const { fetch, loading, error } = useGetFetch();

  const {connectionSet} = useSelector(store=>store.connection)
  
  const endDivRef = useRef();
  
  const getMorePeople = useCallback(async () => {
    const friendSet = new Set(...connectionSet)
    if (loading ) return;
    let data = await fetch(
      "/searchPeople/" +
        ref.current.value.trim() +
        "/" +
        searchList[searchList.length - 1].username
    );
    if (data.length < 10) {
      setHasMore(false);
    }
    data = data.filter(item=>!friendSet.has(item.username))

    setSearchList((prev) => {
      return [...prev, ...data];
    });
  }, [fetch, searchList, loading, connectionSet]);

  useEffect(() => {
    if(!endDivRef.current)return
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;
      getMorePeople();
    });
    observer.observe(endDivRef.current);

    return () => {
      if (endDivRef.current) {
        observer.unobserve(endDivRef.current);
      }
      observer.disconnect();
    };
  }, [getMorePeople]);

  

  return (
    <div className="py-2 overflow-auto h-min-0 customScroll">
      {searchList.map((person) => {
        return (
          <Person key={person.id} person={person}/>
        );
      })}
      {hasMore && <div ref={endDivRef}>loading...</div>}
    </div>
  );
});

export default People;
