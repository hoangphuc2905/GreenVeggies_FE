import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminRouter from "./routes/AdminRouter";
import UserRouter from "./routes/UserRouter";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // Import store
import ErrorRouter from "./routes/ErrorRouter";

const App = () => {
  return (
    <Provider store={store}>
      {" "}
      {/* Truyền store vào Provider */}
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminRouter />} />
          <Route path="/*" element={<UserRouter />} />
          {/* <Route path="/auth/*" element={<AuthRouter />} /> */}
          <Route path="*" element={<ErrorRouter />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
