import { App } from "antd";
import React from "react";
import { Route, Routes } from "react-router-dom";
import UnfoundPage from "../components/error/UnfoundPage";

const ErrorRouter = () => {
  return (
    <App>
      <Routes>
        <Route path="/not-authorized" element={<UnfoundPage />} />
      </Routes>
    </App>
  );
};

export default ErrorRouter;
