import React from "react";
import socketIOClient from "socket.io-client";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import JSONPretty from "react-json-pretty";

import JobsSelector from "./components/JobsSelector";

export default class WorkerIndexPage extends React.Component {
  constructor() {
    super();
    this.state = {
      response: false,
      loading: false,
      workers: undefined,
      endpoint: "http://127.0.0.1:3001"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("job progress", data => {
      console.log(data);
      const { workers } = this.state;
      if (workers) {
        workers.forEach(worker => {
          if (worker.id == data.id) {
            worker.lastMessage = data.message;
          }
        });

        this.setState({ workers });
      }
    });
    this.setState({ loading: true });

    fetch("http://localhost:3000")
      .then(res => {
        return res.json();
      })
      .then(response => {
        console.log(response);
        this.setState({
          loading: false,
          workers: response.data
        });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { workers, loading } = this.state;
    const loadingMarkup = loading && <CircularProgress />;

    const workersTableMarkup = !loading &&
      workers && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last log message</TableCell>
              <TableCell>Params</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workers.map(worker => {
              return (
                <TableRow key={worker.id}>
                  <TableCell>{worker.id}</TableCell>
                  <TableCell>{worker.name}</TableCell>
                  <TableCell>{worker.status}</TableCell>
                  <TableCell>{worker.lastMessage}</TableCell>
                  <TableCell>
                    <JSONPretty id="json-pretty" json={worker.params} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    return (
      <>
        <Card>
          <JobsSelector />
        </Card>
        <Paper elevation={2}>
          {loadingMarkup}
          {workersTableMarkup}
        </Paper>
      </>
    );
  }
}
