/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        grayish: "#333333",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        playfair: ["Playfair Display", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
      },
      width: {
        authwrapper: "min(90%, 25rem)",
        chatwrapper: "min(40%, 20rem)",
        popupwrapper: "min(70%, 18rem)",
        popupwidth: "min(90%, 27rem)",
      },
      margin: {
        authwrapper: "0 auto",
      },
      backgroundColor: {
        "primary-gray": "#2B2D31",
        "darkish-gray": "#1E1F22",

        "message-author": "#5865F2",

        "popup-bg": "#050620",
      },
    },
  },
  plugins: [],
};
