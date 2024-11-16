import React from "react";
import { Route, Routes } from "react-router-dom";

import MenuAdmin from "./components/MenuAdmin";
import Login from "./components/Login";
import MenuUser from "./components/MenuUser";

export function AppRoutes() {

  return (
    <Routes>
      <Route path="/MenuAdmin" element={<MenuAdmin />} />
      <Route path="/MenuUser" element={<MenuUser />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}