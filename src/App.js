import { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Models/Home";

function App() {
  return (
    <Fragment>
      <Router>
        <Switch>
          <Route path="/" component={Home}></Route>
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
