import React from "react";
import { Switch, Route } from "react-router-dom";
import WorkerIndexPage from "../WorkerIndexPage";
import WorkerShowPage from "../WorkerShowPage";

export default class App extends React.Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/" component={WorkerIndexPage} />
          <Route exact path="/workers" component={WorkerIndexPage} />
          <Route path="/workers/:id" component={WorkerShowPage} />
        </Switch>
      </main>
    );
  }
}
