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
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import JSONPretty from "react-json-pretty";
import Grid from "@material-ui/core/Grid";

import JobsSelector from "./components/JobsSelector";

class WorkerIndexPage extends React.Component {
  constructor() {
    super();
    this.state = {
      response: false,
      loading: false,
      workers: undefined,
      endpoint: "http://127.0.0.1:3001",
      hashtag: "",
      jobClassName: ""
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("job progress", data => {
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
    this.fetchJobs();
  }

  onJobClassNameUpdate(jobClassName) {
    this.setState({ jobClassName });
  }

  changeHashtag(changes) {
    const {
      target: { value }
    } = changes;

    this.setState({ hashtag: value });
  }

  fetchJobs() {
    this.setState({ loading: true });

    fetch("http://localhost:3000")
      .then(res => {
        return res.json();
      })
      .then(response => {
        this.setState({
          loading: false,
          workers: response.data
        });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  run() {
    const { jobClassName, hashtag } = this.state;

    fetch("http://localhost:3000/workers/run", {
      method: "POST",
      mode: "cors",
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ jobClassName, hashtag })
    })
      .then(response => {
        this.fetchJobs();
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  render() {
    const { workers, loading, jobClassName } = this.state;
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
        <Grid container justify="center" spacing={24} direction="column">
          <Grid item>
            <Card>
              <CardHeader title="Task runner" />
              <CardContent>
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                >
                  <Grid item>
                    <JobsSelector
                      onUpdate={this.onJobClassNameUpdate.bind(this)}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="name"
                      label="Hashtag"
                      value={this.state.hashtag}
                      onChange={this.changeHashtag.bind(this)}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.run.bind(this)}
                    >
                      Run
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card>
              {loadingMarkup}
              {workersTableMarkup}
            </Card>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default WorkerIndexPage;
