import React from "react";
import socketIOClient from "socket.io-client";
import Header from "./Header";
import Main from "./Main";
import Grid from "@material-ui/core/Grid";
import Workers from "./Workers";
import { withStyles } from "@material-ui/core/styles";
function styles(theme) {
  return {
    root: { flexGrow: 1 },
    paper: { height: 140, width: 100 },
    control: { padding: theme.spacing.unit * 2 }
  };
}
class App extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <>
        <Header />
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Main />
            </Grid>
          </Grid>
        </Grid>
        <Workers />
      </>
    );
  }
}

export default withStyles(styles)(App);
