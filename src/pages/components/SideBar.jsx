import React, { useContext, useEffect, useState } from "react";
import { Source } from "../HomePage";
import axios from "axios";

function SideBar() {
  const source = useContext(Source);

  const [username, setUsername] = useState("");

  function handleClick() {
    source.setActive(true);
  }

  function joinRoom() {
    // continue from here
  }

  useEffect(() => {
    (async function getUserName() {
      await axios
        .post("/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
          accessToken: localStorage.getItem("accessToken"),
        })
        .then((res) => {
          // console.log(res.data);
          if (res.data.newAccessToken) {
            localStorage.setItem("accessToken", res.data.newAccessToken);
          }

          axios
            .get("/username", {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
            })
            .then((res) => setUsername(res.data.username))
            .catch((err) => {
              // console.error(err);
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
            });
        });
      // .catch((err) => console.log(err));
    })();

    console.log(source.rooms);
  }, []);

  return (
    <div
      className="bg-darkish-gray w-chatwrapper select-none text-white"
      style={{ display: source.active ? "none" : "block" }}
    >
      <section className="flex w-authwrapper m-authwrapper justify-between mt-4 items-center">
        <div className="flex items-center gap-2">
          <div className="logo w-12 h-12 rounded-full border-white bg-cyan-900 border-2"></div>
          <h2 className="text-xl font-rubik text-gray-300">Chat App</h2>
        </div>
        <i
          onClick={handleClick}
          className="fa-solid fa-plus text-xl cursor-pointer"
          title="Create Room"
        ></i>
      </section>
      <hr className="mt-5" />
      {source.rooms.length === 0 ? (
        <p className="mt-1 ml-2 text-xl font-mono">No rooms yet</p>
      ) : (
        <div>
          {source.rooms.map((room, index) => {
            return (
              <div
                key={index}
                className="border-2 border-black rounded-md p-2 bg-gray-500 flex flex-col justify-center text-center mt-1 relative"
              >
                <i
                  className="absolute -top-1 right-0 text-lg font-bold rounded-full border-black text-black bg-white px-1"
                  onClick={(e) => {
                    source.rooms.length -= 1;
                    e.target.parentNode.remove();
                  }}
                >
                  X
                </i>
                <p>Join the room: {room}</p>
                <button className="bg-popup-bg" onClick={joinRoom}>
                  Join
                </button>
              </div>
            );
          })}
        </div>
      )}

      <footer className="absolute bottom-0 bg-gray-500 text-gray-900 rounded-r-lg px-4 text-center">
        <p>Welcome Back!</p>
        <h2>{username}</h2>
      </footer>
    </div>
  );
}

export default SideBar;
