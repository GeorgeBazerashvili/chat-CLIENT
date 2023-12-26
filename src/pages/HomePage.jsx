import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import SideBar from "./components/SideBar";
import MainArea from "./components/MainArea";

export const Source = createContext(null);

function HomePage() {
  const [active, setActive] = useState(false);
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);

  const socket = io("http://localhost:3000");

  useEffect(() => {
    socket.on("send-info", (room) => {
      // console.log(room);
      if (rooms.length < 5) setRooms((prev) => [...prev, room]);
    });

    socket.on("connecet", () => {
      console.log("socket connected");
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  function createRoom() {
    if (room.trim()) {
      socket.emit("addroom", room.trim());
      setActive(false);
    }
  }

  function handleSubmit(e) {
    createRoom();
    e.preventDefault();
  }

  useEffect(() => {
    console.log(rooms);
  }, [rooms]);

  return (
    <>
      <div className="chat flex w-full h-screen bg-gray-800">
        <Source.Provider
          value={{ active, setActive, rooms, setRooms, handleSubmit }}
        >
          <SideBar />
          <MainArea />
          <form
            onSubmit={handleSubmit}
            className="popup absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-gray-700 text-white w-popupwidth flex flex-col py-14 font-mono border-blue-900 rounded-md border-2"
            style={{ display: active ? "flex" : "none" }}
          >
            <i
              className="absolute -top-3 -right-1 bg-blue-800 rounded-full px-2 font-bold cursor-pointer select-none"
              onClick={() => setActive(false)}
            >
              X
            </i>
            <div className="mt-2 flex flex-col w-popupwrapper m-authwrapper">
              <label
                htmlFor="room-name"
                className="text-center text-2xl font-bold font-roboto mb-2"
              >
                enter room name
              </label>
              <input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                type="text"
                id="room-name"
                placeholder="Room Name"
                className="text-black mt-2 px-4 py-2 rounded-md bg-gray-200 outline-none"
              />
            </div>
            <button className="mt-3 bg-popup-bg w-popupwrapper m-authwrapper rounded-md py-2 px-2 text-xl font-bold">
              Create Room
            </button>
          </form>
        </Source.Provider>
      </div>
    </>
  );
}

export default HomePage;
