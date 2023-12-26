import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Source } from "../HomePage";
import { AppSource } from "../../App";

function MainArea() {
  const [active, setActive] = useState(false);
  const [value, setValue] = useState("");
  const [file, setFile] = useState("");
  const [path, setPath] = useState("");
  const [returnedFile, setReturnedFile] = useState("");

  const source = useContext(Source);
  const appSource = useContext(AppSource);

  function handleChange(e) {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    async function checkDate() {
      await axios
        .post("/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
          accessToken: localStorage.getItem("accessToken"),
        })
        .then((res) => {
          if (res.data.newAccessToken)
            localStorage.setItem("accessToken", res.data.newAccessToken);
        })
        .catch((err) => {
          // console.error(err);
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");
          appSource.setLoggedIn(false);
        });
    }

    checkDate();

    setInterval(() => {
      checkDate();
    }, 1000 * 60 * 5);

    return () => {
      clearInterval(() => {
        checkDate();
      }, 1000 * 60 * 5);
    };
  }, []);

  async function removeFile() {
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
          .post(
            "/removefile",
            {
              fileName: returnedFile,
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
            }
          )
          .then(() => {
            setPath("");
          });
        // .catch((err) => console.error(err));
      })
      .catch((err) => {
        // console.error(err);
        appSource.setLoggedIn(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      });
  }

  useEffect(() => {
    (async function upload() {
      const formData = new FormData();
      formData.append("file", file);
      await axios
        .post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const image = res.data.filePath;
          if (image) {
            setPath(`http://localhost:3000/uploads/${image}`);
            setReturnedFile(image);
          }
        });
      // .catch((err) => console.log(err.message));
    })();
  }, [file]);

  useEffect(() => {
    setActive(false);
  }, [path]);

  return (
    <div
      className="bg-primary-gray flex-1 select-none relative"
      style={{ display: source.active ? "none" : "block" }}
    >
      <input
        type="text"
        placeholder="type your message..."
        className="text-gray-300 bg-darkish-gray absolute bottom-3 left-6 right-6 py-2 pl-12 rounded-md font-mono"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <i
        className="fa-solid fa-circle-plus absolute left-8 bottom-4 text-2xl text-gray-500 cursor-pointer"
        title="attach files"
        onClick={() => setActive((prev) => !prev)}
      ></i>
      <input
        type="file"
        name="file"
        onChange={(e) => handleChange(e)}
        style={{ display: active ? "block" : "none" }}
        className="file-upload bottom-14 left-3 rounded-lg absolute text-transparent outline-none"
      />
      <i
        className="fa-solid fa-paper-plane absolute bottom-4 right-10 text-2xl text-gray-300 cursor-pointer"
        style={{ display: value.trim() || path ? "block" : "none" }}
        title="send message"
      ></i>
      <div
        className="absolute bottom-14 left-8 w-52 aspect-video"
        style={{ display: path ? "block" : "none" }}
      >
        <i
          className="absolute -right-2 -top-3 bg-white z-20 text-black font-bold text-xl px-1 rounded-full"
          onClick={removeFile}
        >
          X
        </i>
        <img
          src={path}
          className=" aspect-video w-52 absolute bottom-0"
          alt="Some kind of image"
        />
      </div>
    </div>
  );
}

export default MainArea;
