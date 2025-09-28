import { HiMagnifyingGlass } from "react-icons/hi2";

import Connections from "./Connections";
import People from "./People";
import { useState } from "react";

function Contacts() {
  const [searchList, setSearchList] = useState([])

  let handleSearch = (e)=>{
    console.log(e.target.value)
  }

  return (
    <div className="bg-amber-950 [grid-area:sideBar] p-1 flex flex-col h-full min-h-0">
      <div className="p-1 bg-red-400 rounded-lg flex gap-2 items-center">
        <HiMagnifyingGlass className="text-4xl px-1" />
        <input type="text" className="grow-1 outline-0" onKeyUp={handleSearch} placeholder="Find someone new" />
      </div>
      {searchList.length!==0 && <People/>}
      {searchList.length===0 && <Connections/>}
    </div>
  );
}

export default Contacts;
