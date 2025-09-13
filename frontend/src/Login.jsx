import { useRef } from "react";
import rolling from "./assets/rolling.gif";
import { useAuthContext } from "./hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import usePostFetch from "./hooks/usePostFetch";
let Login = () => {
  const usernameRef = useRef();
  const password = useRef();

  const {error, loading, fetch} = usePostFetch()

  const navigate = useNavigate();

  const { setUsername } = useAuthContext();

  const handleSubmit = async(e)=>{
    e.preventDefault()
    const data = await fetch("/login",{
      username: usernameRef.current.value,
      password: password.current.value
    }, true)
    if(data){
      setUsername(data.username)
      localStorage.setItem("JwtToken",data.token)
      navigate("/")
    }
  }

  return (
    <form
      action=""
      onSubmit={handleSubmit}
      className="w-[90%] max-w-[500px] p-10 bg-stone-900 border border-white mt-10 rounded-2xl shadow-lg"
    >
      <h1 className="text-4xl text-center font-bold mb-7 text-white">
        Todo Login
      </h1>
      <label htmlFor="email">
        <div className="text-2xl mt-2 text-white">Username: </div>
        <input
          ref={usernameRef}
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
        {error && <div className="text-center text-lg text-red-500">{error}</div>}
        {loading && (
          <img
            className="h-10 w-10 absolute top-1 left-[60%]"
            src={rolling}
            alt=""
          />
        )}
      </div>
      {/* <Link to="/register" className="text-blue-600 text-center block mt-3">
        Register
      </Link> */}
    </form>
  );
};

export default Login;
