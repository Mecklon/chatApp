import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { FaChevronUp } from "react-icons/fa";
import LangDropDown from "./langDropDown";

function LangSearch() {
  const [expanded, setExpanded] = useState(false);

  const [currentLang, setCurrentLang] = useState("English");
  
  const dropDownRef = useRef(null)
  return (
    <div ref={dropDownRef} className="text-lg ml-2 relative ">
      <div
        className="flex gap-2 items-center hover:bg-bg-light p-1 px-2 rounded cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {currentLang}
        <FaChevronUp className={`${expanded && "rotate-180"} duration-300`} />
      </div>

      {expanded && (
        <LangDropDown setCurrentLang={setCurrentLang} setExpanded={setExpanded} ref={dropDownRef}/>
      )}
    </div>
  );
}

export default LangSearch;
