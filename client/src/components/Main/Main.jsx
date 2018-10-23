import React from "react";
import { Switch, Route } from "react-router-dom";
import WorkerIndexPage from "../WorkerIndexPage";
import WorkerShowPage from "../WorkerShowPage";
import InstagramUsersPage from "../InstagramUsersPage";
import FollowersPage from "../FollowersPage";

export default class App extends React.Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/" component={FollowersPage} />
          <Route exact path="/workers" component={WorkerIndexPage} />
          <Route path="/workers/:id" component={WorkerShowPage} />
          <Route path="/instagram-users" component={InstagramUsersPage} />
          <Route path="/followers" component={FollowersPage} />
        </Switch>
      </main>
    );
  }
}
