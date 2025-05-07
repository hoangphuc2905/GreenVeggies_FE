import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRouter from "./routes/AdminRouter";
import UserRouter from "./routes/UserRouter";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // Import store
import ErrorRouter from "./routes/ErrorRouter";
import RoleRedirect from "./utils/RoleRedirect"; // Import RoleRedirect

const App = () => {
  const role = "guest";

  return (
    <Provider store={store}>
      <Router>
        {/* <RoleRedirect role={role} /> Add RoleRedirect */}
        <Routes>
          <Route path="/admin/*" element={<AdminRouter />} />
          <Route path="/*" element={<UserRouter />} />
          <Route path="/not-authorized/*" element={<ErrorRouter />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
