import { HiMagnifyingGlass } from "react-icons/hi2";

import Connections from "./Connections";
import People from "./People";
import { useCallback, useEffect, useRef, useState } from "react";
import useGetFetch from "../hooks/useGetFetch";
import { useSelector } from "react-redux";

function Contacts() {
  const [searchList, setSearchList] = useState([]);
  const [loadingSearchList, setLoadingSearchList] = useState(false);
  const [searching, setSearching] = useState(false);

  const inputRef = useRef()

  const { fetch } = useGetFetch();
  
  const  {connectionSet,connections} = useSelector(store=>store.connection)
  const friendSet = new Set(...connectionSet)

  const timeoutRef = useRef(null);


  
  //add inifinite scrolling functionality
  const handleSearch = useCallback(
    async (e) => {

      if (e.target.value === null || e.target.value.trim() === "") {
        setSearchList([]);
        setSearching(false);
        return;
      }
      setSearching(true);
      setLoadingSearchList(true);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        /* const cursor =
          searchList.length !== 0
            ? searchList[searchList.length - 1].username
            : "a"; */
        const cursor = 'a'
        let data = await fetch(
          "/searchPeople/" + e.target.value.trim() + "/" + cursor
        );
        data = data.filter(person=> !friendSet.has(person.username))
        setLoadingSearchList(false);
        if (!data) return;
        setSearchList(data);
      }, 500);
    },
    [fetch]
  );

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="bg-amber-950 [grid-area:sideBar] py-1 flex flex-col h-full min-h-0">
      <div className="p-1 mx-1 bg-red-400 rounded-lg flex gap-2 items-center">
        <HiMagnifyingGlass className="text-4xl px-1" />
        <input
          type="text"
          ref={inputRef}
          className="grow-1 outline-0"
          onKeyUp={handleSearch}
          placeholder="Find someone new"
        />
      </div>
      {!loadingSearchList && searchList.length!==0 && (
        <People searchList={searchList} setSearchList={setSearchList} ref={inputRef}/>
      )}
      {loadingSearchList && <div>loading..</div>}
      {!searching && <Connections />}
    </div>
  );
}

export default Contacts;
