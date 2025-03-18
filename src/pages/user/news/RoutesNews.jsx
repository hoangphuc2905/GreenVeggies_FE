// src/App.js
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import News from "./News";
import NewsDetail from "./NewsDetail";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={News} />
        <Route path="/news/:id" component={NewsDetail} /> {/* Trang chi tiết */}
      </Switch>
    </Router>
  );
}

export default App;
