import { useEffect, useRef, useState } from "react";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import rolling from "./assets/rolling.gif";
import { useAuthContext } from "./hooks/useAuthContext";
import usePostFetch from "./hooks/usePostFetch";
function Signup() {
  const { setUsername } = useAuthContext();
  const { error, loading, fetch } = usePostFetch();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetch(
      "/signup",
      {
        username: name.current.value,
        email: email.current.value,
        password: password.current.value,
      },
      true
    );

    if (data) {
      localStorage.setItem("JwtToken", data.token);
      setUsername(data.username);
      navigate("/")
    }
  };

  const name = useRef();
  const email = useRef();
  const password = useRef();

  return (
    <form
      onSubmit={handleSubmit}
      action=""
      className="w-[90%] max-w-[500px] p-10 bg-stone-900 border border-white mt-10 rounded-2xl shadow-lg"
    >
      <h1 className="text-4xl text-center font-bold mb-7 text-white">
        Todo Registeration
      </h1>
      <label htmlFor="name">
        <div className="text-2xl text-white">Username: </div>
        <input
          ref={name}
          required
          className="mt-2 text-gray-600 text-xl p-2 bg-stone-950 w-[100%] rounded outline-none focus:ring-blue-400 focus:ring-2 duration-150"
          type="text"
          id="name"
        />
      </label>
      <label htmlFor="email">
        <div className="text-2xl mt-2 text-white">Email: </div>
        <input
          ref={email}
          required
          className="mt-2 text-gray-600 text-xl p-2 bg-stone-950 w-[100%] rounded outline-none focus:ring-blue-400 focus:ring-2 duration-150"
          type="text"
          id="email"
        />
      </label>
      <label htmlFor="password">
        <div className="text-2xl mt-2 text-white">Password: </div>
        <input
          ref={password}
          required
          className="mt-2 text-gray-600 text-xl p-2 bg-stone-950 w-[100%] rounded outline-none focus:ring-blue-400 focus:ring-2 duration-150"
          type="password"
          id="password"
        />
      </label>
      <div className="relative mt-10">
        <input
          disabled={loading}
          type="submit"
          className="w-[100%] rounded-xl bg-blue-800 text-white text-2xl p-2  hover:bg-blue-900 duration-300 cursor-pointer"
        />
        {loading && (
          <img
            className="h-10 w-10 absolute top-1 left-[60%]"
            src={rolling}
            alt=""
          />
        )}
      </div>
      {error && <div className="text-center text-lg text-red-500">{error}</div>}

      {/* <Link to="/login" className="text-blue-600 text-center block mt-3">
        Login
      </Link> */}
    </form>
  );
}

export default Signup;
