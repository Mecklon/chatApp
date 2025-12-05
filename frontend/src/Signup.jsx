import { useEffect, useRef, useState } from "react";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import rolling from "./assets/rolling.gif";
import { useAuthContext } from "./hooks/useAuthContext";
import usePostFetch from "./hooks/usePostFetch";
import { PiGraphLight } from "react-icons/pi";

function Signup() {
  const { setUsername, setEmail, setUnseenNotifications, setUnseenRequests } = useAuthContext();
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
      setEmail(data.email);
      setUnseenNotifications(parseInt(data.unseenNotifications))
      setUnseenRequests(parseInt(data.unseenRequests))
      navigate("/");
    }
  };

  const name = useRef();
  const email = useRef();
  const password = useRef();

  return (
    <form
      onSubmit={handleSubmit}
      action=""
      className="w-[90%] max-w-[500px] p-10 bg-background border border-borderColor mt-10 rounded-2xl shadow-2xl"
    >
      <h1 className="text-2xl mb-5 flex gap-1 items-center text-primary">
        <PiGraphLight className="text-5xl text-primary" />
        Uni Talk
      </h1>
      <h1 className="text-4xl  font-bold mb-3 text-primary">Signup To Talk</h1>
      <label htmlFor="name">
        <div className="text-2xl text-primary">Username: </div>
        <input
          autoFocus
          ref={name}
          required
          className="mt-2 text-gray-600 text-xl p-2 bg-inputBackground border-1 w-[100%] rounded outline-none focus:ring-blue-400 focus:ring-2 duration-150"
          type="text"
          id="name"
        />
      </label>
      <label htmlFor="email">
        <div className="text-2xl mt-2 text-primary">Email: </div>
        <input
          ref={email}
          required
          className="mt-2 text-gray-600 border-1 text-xl p-2 bg-inputBackground w-[100%] rounded outline-none focus:ring-blue-400 focus:ring-2 duration-150"
          type="text"
          id="email"
        />
      </label>
      <label htmlFor="password">
        <div className=" text-2xl mt-2 text-primary">Password: </div>
        <input
          ref={password}
          required
          className="mt-2 text-gray-600 text-xl p-2 bg-inputBackground border-1 w-[100%] rounded outline-none focus:ring-blue-400 focus:ring-2 duration-150"
          type="password"
          id="password"
        />
      </label>
      <div className="relative mt-10">
        <input
          disabled={loading}
          type="submit"
          className="w-[100%] rounded-xl bg-secondary text-white text-2xl p-2  hover:bg-secondaryHover duration-300 cursor-pointer"
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

      <Link to="/login" className="text-secondary text-center block mt-3">
        Login
      </Link>
    </form>
  );
}

export default Signup;
