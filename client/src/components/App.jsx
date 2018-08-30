import React from "react";
import socketIOClient from "socket.io-client";
import Header from "./Header";
import Main from "./Main";

export default class App extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     response: false,
  //     endpoint: "http://127.0.0.1:3001"
  //   };
  // }

  // componentDidMount() {
  //   const { endpoint } = this.state;
  //   const socket = socketIOClient(endpoint);
  //   socket.on("job progress", data => {
  //     this.setState({ response: data });
  //   });

  //   fetch("http://localhost:3000")
  //     .then(res => {
  //       return res.json();
  //     })
  //     .then(response => {
  //       console.log(response);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }
  render() {
    return (
      <>
        <Header />
        <Main />
      </>
    );
  }
}
