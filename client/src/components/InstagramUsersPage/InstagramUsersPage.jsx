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
import DeleteIcon from "@material-ui/icons/Delete";

import JSONPretty from "react-json-pretty";
import Grid from "@material-ui/core/Grid";

class InstagramUsersPage extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      loading: false,
      blockedUsers: []
    };
  }

  componentDidMount() {
    this.fetchBlockedUsers();
  }

  fetchBlockedUsers() {
    fetch("http://localhost:3000/instagram-users/")
      .then(res => {
        return res.json();
      })
      .then(response => {
        this.setState({
          loading: false,
          blockedUsers: response.data
        });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  changeUsername(event) {
    const {
      target: { value }
    } = event;

    this.setState({ username: value });
  }

  block() {
    const { username } = this.state;
    fetch("http://localhost:3000/instagram-users/block", {
      method: "POST",
      mode: "cors",
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ username })
    })
      .then(response => {
        this.fetchBlockedUsers();
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  unblock(id) {
    return () => {
      fetch("http://localhost:3000/instagram-users/unblock", {
        method: "POST",
        mode: "cors",
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({ id })
      })
        .then(response => {
          this.fetchBlockedUsers();
        })
        .catch(error => {
          console.log(error);
          throw error;
        });
    };
  }

  render() {
    const { loading, blockedUsers } = this.state;
    const blockedUsersTableMarkup = !loading && (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blockedUsers.map(blockedUser => {
            return (
              <TableRow key={blockedUser.id}>
                <TableCell>{blockedUser.id}</TableCell>
                <TableCell>{blockedUser.username}</TableCell>
                <TableCell>
                  <DeleteIcon onClick={this.unblock(blockedUser.id)} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
    return (
      <Grid container justify="center" spacing={24} direction="column">
        <Grid item>
          <Card>
            <CardHeader title="Blocked Users" />
            <CardContent>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
              >
                <Grid item>
                  <TextField
                    id="name"
                    label="Username"
                    value={this.state.username}
                    onChange={this.changeUsername.bind(this)}
                    margin="normal"
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.block.bind(this)}
                  >
                    Block
                  </Button>
                </Grid>
              </Grid>
              {blockedUsersTableMarkup}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default InstagramUsersPage;
