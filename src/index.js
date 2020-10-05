import React from "react";
import ReactDOM from "react-dom";
// import "bulma";
import "./index.css";
import App from "./App";
import { AppContextProvider } from "./app-context";

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
