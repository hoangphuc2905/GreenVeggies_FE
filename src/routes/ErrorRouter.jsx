import { App } from "antd";
import { Route, Routes } from "react-router-dom";
import UnfoundPage from "../components/error/UnfoundPage";

const ErrorRouter = () => {
  return (
    <App>
      <Routes>
        <Route path="" element={<UnfoundPage />} />
      </Routes>
    </App>
  );
};

export default ErrorRouter;
