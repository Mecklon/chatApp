import Signup from "./Signup";
import Login from "./Login";
import Todo from "./Todo";
import "./index.css";
import { useAuthContext } from "./hooks/useAuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const { username } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        {username ? (
          <>
            <Route path="/" element={<Todo />} />
            <Route path="*" element={<Todo />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
