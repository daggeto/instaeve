import React from "react";
import socketIOClient from "socket.io-client";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:3000"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("some event", data => {
      this.setState({ response: data });
    });
  }

  render() {
    const { response } = this.state;

    return (
      <div style={{ textAlign: "center" }}>
        <h1>Response: {response.for}</h1>
      </div>
    );
  }
}
