import React from "react";
import { Route, Routes } from "react-router-dom";

import MenuAdmin from "./components/MenuAdmin";
import Login from "./components/Login";

export function AppRoutes() {

  return (
    <Routes>
      <Route path="/MenuAdmin" element={<MenuAdmin />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}