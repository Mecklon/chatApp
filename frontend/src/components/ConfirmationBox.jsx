import React from "react";
import { motion } from "motion/react";

function ConfirmationBox({ setExpanded, handleYes, message }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 bg-black/75 flex  text-text items-center justify-center z-10"
    >
      <motion.div
        initial={{ opacity:0, translateY:100}}
        animate={{ opacity:1, translateY:0}}
        transition={{
          duration: 0.1
        }}


        className="bg-bg border border-border p-6 rounded-2xl max-w-1/2"
      >
        <div className="font-bold  text-3xl">Are you sure?</div>
        <div className="mt-3 text-2xl">{message}</div>
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
      </motion.div>
    </div>
  );
}

export default ConfirmationBox;
