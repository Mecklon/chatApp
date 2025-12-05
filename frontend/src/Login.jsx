import { useRef } from "react";
import rolling from "./assets/rolling.gif";
import { useAuthContext } from "./hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import usePostFetch from "./hooks/usePostFetch";
import { PiGraphLight } from "react-icons/pi";
let Login = () => {
  const usernameRef = useRef();
  const password = useRef();

  const { error, loading, fetch } = usePostFetch();

  const navigate = useNavigate();

  const { setUsername,setEmail, setProfile, setCaption, setUnseenNotifications,setUnseenRequests } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetch(
      "/login",
      {
        username: usernameRef.current.value,
        password: password.current.value,
      },
      true
    );
    if (data) {
      setUsername(data.username);
      setEmail(data.email);
      setUnseenNotifications(parseInt(data.unseenNotifications))
      setUnseenRequests(parseInt(data.unseenRequests))
      if (data.profile) {
        setProfile(data.profile);
      }
      setCaption(data.caption);
      localStorage.setItem("JwtToken", data.token);
      navigate("/");
    }
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit}
      className="w-[90%] max-w-[500px] p-10 bg-background border border-borderColor mt-10 rounded-2xl shadow-2xl"
    >
      <button className="p-2 rounded bg-background text-primary border-borderColor border cursor-pointer" onClick={(e)=>{
        e.preventDefault()
        document.documentElement.classList.toggle("dark")
      }}>theme</button>
      <h1 className="text-2xl mb-5 flex gap-1 items-center text-primary">
        <PiGraphLight className="text-5xl text-primary" />
        Uni Talk
      </h1>
      <h1 className="text-4xl font-bold mb-3 text-primary">Welcome Back!!</h1>
      <label htmlFor="email">
        <div className="text-2xl mt-2 text-primary">Username: </div>
        <input
          autoFocus
          ref={usernameRef}
          required
          className="mt-2 text-gray-600 text-xl p-2 bg-inputBackground w-[100%] rounded border-1 outline-none focus:ring-blue-400 focus:ring-2 duration-150"
          type="text"
          id="email"
        />
      </label>
      <label htmlFor="password">
        <div className="text-2xl mt-2 text-primary">Password: </div>
        <input
          ref={password}
          required
          className="mt-2 text-gray-600 text-xl p-2 bg-inputBackground w-[100%] rounded border-1 outline-none focus:ring-blue-400 focus:ring-2 duration-150"
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
        {error && (
          <div className="text-center text-lg text-red-500">{error}</div>
        )}
        {loading && (
          <img
            className="h-10 w-10 absolute top-1 left-[60%]"
            src={rolling}
            alt=""
          />
        )}
      </div>
      <Link to="/register" className="text-secondary text-center block mt-3">
        Register
      </Link>
    </form>
  );
};

export default Login;
