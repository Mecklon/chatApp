import Signup from "./Signup";
import Login from "./Login";
import "./index.css";
import { useAuthContext } from "./hooks/useAuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const { username } = useAuthContext();

  return (
    <BrowserRouter>
      {!username ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="*" element={<div>App</div>}></Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
