import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./home";

import "./styles/main.scss"

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
