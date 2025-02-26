import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminRouter from "./routes/AdminRouter";
import UserRouter from "./routes/UserRouter";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} />

        <Route path="/*" element={<UserRouter />} />

        {/* <Route path="/auth/*" element={<AuthRouter />} /> */}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
