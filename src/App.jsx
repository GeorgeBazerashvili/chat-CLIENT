import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useState, useEffect, createContext } from "react";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";

export const AppSource = createContext(null);

function App() {
  axios.defaults.baseURL = "https://chat-rest-production.up.railway.app";
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  useEffect(() => {
    async function checkDate() {
      await axios
        .post("/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
          accessToken: localStorage.getItem("accessToken"),
        })
        .then((res) => {
          if (res.data.newAcessToken) {
            localStorage.setItem("accessToken", res.data.newAccessToken);
          }
        })
        .catch((err) => {
          // console.error(err);
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");
          setLoggedIn(false);
        });
    }

    if (
      localStorage.getItem("refreshToken") ||
      localStorage.getItem("accessToken")
    ) {
      checkDate();
    }
    const handleStorageChange = () => {
      if (localStorage.getItem("accessToken")) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AppSource.Provider value={{ loggedIn, setLoggedIn }}>
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <HomePage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/login"
          element={!loggedIn ? <LoginPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/register"
          element={!loggedIn ? <RegisterPage /> : <Navigate to="/" />}
        ></Route>
      </Routes>
    </AppSource.Provider>
  );
}

export default App;

/**
 * -------------------
 * From: George Bazerashvili
 * To: George Bazerashvili
 * subject: Todo List
 *
 * Today we are going to do couple of things:
 *
 * 2. we are going to show user profile on the bottom of the SideBar.jsx
 * 3. we are going to create a module of the message
 * 4. we are going to save the messages to the database when message is sent
 * 5. we are going to add image paths to the database once we click on the send button
 *
 * [Current]: 2. show user profile on the bottom of the SideBar.jsx
 *
 * Hope everything goes well man.
 *
 * Good luck bro.
 *
 * From George.
 * -------------------
 */
