import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AppSource } from "../App";

function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const source = useContext(AppSource);

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post("/auth/register", {
        username: userName,
        email,
        password,
      })
      .then((res) => {
        const { accessToken, refreshToken } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        source.setLoggedIn(true);
      })
      .catch((err) => {
        let error = err.response.data.err;
        let splittedErr = error
          .replace("User validation failed: ", "")
          .split(", ");
        let validationErr = splittedErr[0].split(":")[1];
        setValidationError(validationErr);
      });
  }

  return (
    <div className="w-full h-screen bg-slate-800 font-roboto">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-authwrapper border-2 shadow-black shadow-2xl rounded-md border-gray-500 font-roboto font-bold bg-gray-800 py-5 absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
      >
        <h2 className="text-4xl font-normal font-rubik text-white text-center">
          Sign Up
        </h2>
        <p className="m-authwrapper w-authwrapper text-red-500 font-light font-mono mt-2">
          {validationError}
        </p>
        <div className="w-authwrapper m-authwrapper mt-1">
          <label htmlFor="username" className="text-white">
            Username
          </label>
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            className="w-full px-3 py-2 rounded-md outline-black"
            id="username"
          />
        </div>
        <div className="w-authwrapper m-authwrapper mt-3">
          <label htmlFor="email" className="text-white">
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="w-full px-3 py-2 rounded-md outline-black"
            id="email"
          />
        </div>
        <div className="w-authwrapper m-authwrapper mt-2">
          <label htmlFor="password" className="text-white">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full px-3 py-2 rounded-md outline-black"
            id="password"
          />
        </div>
        <button className="text-white border-2 border-white py-2 px-8 rounded-md mt-4 ml-5 text-xl duration-500 bg-inherit font-rubik hover:bg-gray-900">
          Register
        </button>
        <hr className="mt-5" />
        <p className="mt-5 text-center text-white text-md">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-200">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
