import { HiMagnifyingGlass } from "react-icons/hi2";

import Connections from "./Connections";
import People from "./People";
import { useCallback, useEffect, useRef, useState } from "react";
import useGetFetch from "../hooks/useGetFetch";

function Contacts() {
  const [searchList, setSearchList] = useState([]);
  const [loading, setLoading] = useState(false)

  const { fetch } = useGetFetch();

  const timeoutRef = useRef(null);

  const handleSearch = useCallback(
    async (e) => {
      if (e.target.value === null || e.target.value === "") {
        setSearchList([]);
        return;
      }
      setLoading(true)
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        const cursor = searchList? searchList[searchList.length-1].username: "";
        const data = await fetch("/searchPeople/" + e.target.value + "/" + cursor);
        console.log(data)
        setLoading(false)
        if(!data)return
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
          className="grow-1 outline-0"
          onKeyUp={handleSearch}
          placeholder="Find someone new"
        />
      </div>
      {searchList.length !== 0 && (
        !loading && <People searchList={searchList} setSearchList={setSearchList} />
      )}
      {(
        loading && <div>loading..</div>
      )}
      {searchList.length === 0 && <Connections />}
    </div>
  );
}

export default Contacts;
