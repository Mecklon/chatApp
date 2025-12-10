import React from "react";

function ConfirmationBox({ setExpanded, handleYes }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-10"
    >
      <div className="bg-white p-6 rounded-2xl max-w-1/2">
        <div className="font-bold text-3xl">Are you sure?</div>
        <div className="mt-3 text-2xl">
          Kick Mecklon Fernandes from Group The First Group
        </div>
        <div className="flex justify-around items-center mt-10">
          <button
            onClick={() => setExpanded(false)}
            className="bg-stone-500 text-white text-2xl cursor-pointer p-2 rounded-lg px-6"
          >
            No
          </button>
          <button
            onClick={() => {
              setExpanded(false);
              handleYes();
            }}
            className="bg-blue-600 text-white text-2xl cursor-pointer p-2 rounded-lg px-6"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationBox;
