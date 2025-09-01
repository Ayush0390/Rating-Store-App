import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Stores from "./pages/Stores";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardOwner from "./pages/DashboardOwner";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/owner" element={<DashboardOwner />} />
        </Routes>
      </div>
    </Router>
  );
}
