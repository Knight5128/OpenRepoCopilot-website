import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "reactflow/dist/style.css";
import "./styles/global.css";

// Note: intentionally NOT wrapped in <React.StrictMode>. Its dev-only double
// invocation of effects thrashes ReactFlow's internal node measurement and
// leaves edges unrendered. Production never double-invokes regardless.
createRoot(document.getElementById("root")).render(
  <HashRouter>
    <App />
  </HashRouter>,
);
