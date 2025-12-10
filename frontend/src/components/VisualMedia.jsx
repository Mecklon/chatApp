import React, { useState } from "react";
import ExpandableMedia from "./ExpandableMedia";

function VisualMedia({ mediaList }) {
  return (
    <>
      {mediaList.map((media) => {
        return <ExpandableMedia key={media.id} media={media}/>;
      })}
    </>
  );
}

export default VisualMedia;
