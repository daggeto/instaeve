import React from "react";
import { Link } from "react-router-dom";

export default class App extends React.Component {
  render() {
    return (
      <header>
        <ul>
          <li>
            <Link to="/instagram-users">InstagramUsers</Link>
          </li>
          <li>
            <Link to="/followers">Followers</Link>
          </li>
          <li>
            <Link to="/workers">Workers</Link>
          </li>
        </ul>
      </header>
    );
  }
}
