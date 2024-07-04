import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
// import { MemoryRouter } from "react-router-dom";
// import { MemoryRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <MemoryRouter> */}
    <App />
    {/* </MemoryRouter> */}
  </React.StrictMode>
);

reportWebVitals();
