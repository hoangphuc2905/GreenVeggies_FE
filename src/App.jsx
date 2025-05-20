import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import RoleBasedRouter from "./routes/RoleBaseRouter";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <RoleBasedRouter />
      </Router>
    </Provider>
  );
};

export default App;
