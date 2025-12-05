import Signup from "./Signup";
import Login from "./Login";
import Home from "./components/Home";
import "./index.css";
import { useAuthContext } from "./hooks/useAuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import WebSocketProvider from "./context/WebSocketProvider";

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
          <Route
            path="*"
            element={
              <Provider store={store}>
                <WebSocketProvider>
                  <Home />
                </WebSocketProvider>
              </Provider>
            }
          ></Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
