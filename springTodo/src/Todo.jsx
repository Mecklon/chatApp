import { useRef, useState, useEffect } from "react";
import Task from "./Task";
import { useAuthContext } from "./hooks/useAuthContext";
import useGetFetch from "./hooks/useGetFetch";
import usePostFetch from "./hooks/usePostFetch";
const Todo = () => {
  const title = useRef();
  const due = useRef();
  const body = useRef();
  const { setUsername } = useAuthContext();

  const {
    state: tasks,
    setState: setTasks,
    error,
    loading,
    fetch,
  } = useGetFetch([]);

  const handleType = (e) => {
    e.target.style.height = e.target.scrollHeight + "px";
  };


  useEffect(() => {
    const getTasks = async () => {
      await fetch("/post");
    };
    getTasks();
  }, []);

  const {error: sendError, loading : sendLoading, fetch: postFetch} = usePostFetch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data =  await postFetch("/post", {
      title: title.current.value,
      body: body.current.value,
      due: due.current.value,
    });

    setTasks((prev) => {
      return [data, ...prev];
    });

    title.current.value = "";
    due.current.value = "";
    body.current.value = "";
  };

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem("JwtToken");
  };

  return (
    <div className="w-[90%] max-w-[700px] p-2 bg-stone-900 border-white mt-10 rounded shadow-lg font-mono">
      <div
        className="fixed top-10 right-10 p-3 text-2xl text-white rounded-4xl bg-stone-700 cursor-pointer px-6 hover:bg-stone-600 duration-300"
        onClick={handleLogout}
      >
        Logout
      </div>
      <form action="" onSubmit={handleSubmit}>
        <input
          ref={title}
          type="text"
          required
          className="bg-stone-950 rounded w-full p-1 text-slate-600 outline-none focus:ring-1 focus:ring-blue-400 mb-3 duration-300 px-3"
          placeholder="Task Title"
        />
        <textarea
          required
          ref={body}
          type="text"
          onChange={handleType}
          className="bg-stone-950 rounded w-full p-1 text-slate-600 outline-none focus:ring-1 focus:ring-blue-400 mb-1 duration-300 px-3"
          placeholder="Description"
        ></textarea>
        <input
          ref={due}
          required
          type="datetime-local"
          className="bg-stone-950 rounded w-full p-1 text-slate-600 outline-none focus:ring-1 focus:ring-blue-400 mb-3 duration-300 px-3"
          placeholder="Task Title"
        />
        <input
          type="submit"
          className="bg-blue-800 text-white p-1 rounded w-full font-bold text-2xl hover:bg-blue-900 duration-300 cursor-pointer mt-2"
        />
      </form>
      {loading && <div>Loading.....</div>}
      <div className="mt-4 max-h-160 overflow-auto scroll">
        {tasks.map((task) => (
          <Task key={task.id} task={task} setTasks={setTasks} />
        ))}
      </div>
      {error && <div className="text-center text-lg text-red-500">{error}</div>}
    </div>
  );
};

export default Todo;
