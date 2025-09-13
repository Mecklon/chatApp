import Signup from "./Signup";
import Login from "./Login";
import Todo from "./Todo";
import "./index.css";
import { useAuthContext } from "./hooks/useAuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
