import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import "./index.css";


/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}


/* =========================================================
   MAIN APP
========================================================= */

function MainApp() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/"
        element={<Login />}
      />


      {/* REGISTER */}
      <Route
        path="/register"
        element={<Register />}
      />


      {/* PROTECTED MEETING DASHBOARD */}
      <Route
        path="/meetings"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />


      {/* UNKNOWN URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}


/* =========================================================
   RENDER APPLICATION
========================================================= */

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <BrowserRouter>

      <MainApp />

    </BrowserRouter>

  </React.StrictMode>
);