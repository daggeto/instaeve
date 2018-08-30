import React from "react";
import { Link } from "react-router-dom";

export default class App extends React.Component {
  render() {
    return (
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/workers">All workers</Link>
            </li>
            <li>
              <Link to="/workers/2">One worker</Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
