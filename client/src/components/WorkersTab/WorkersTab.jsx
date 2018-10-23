import React from "react";
import socketIOClient from "socket.io-client";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import { Scrollbars } from "react-custom-scrollbars";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

import JSONPretty from "react-json-pretty";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  paper: {
    position: "absolute",
    width: "90%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  }
});

class WorkersTab extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      modalOpen: false,
      workerParams: null
    };
  }

  getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
      overflow: "auto"
    };
  }

  openParamsModal(workerParams) {
    return () => {
      this.setState({ workerParams, modalOpen: true });
    };
  }

  closeParamsModal() {
    this.setState({ workerParams: null, modalOpen: false });
  }

  render() {
    const { loading, workerParams, modalOpen } = this.state;
    const { workers, classes } = this.props;

    const paramsModal = (
      <Modal open={modalOpen} onClose={this.closeParamsModal.bind(this)}>
        <div style={this.getModalStyle()} className={classes.paper}>
          <JSONPretty id="json-pretty" json={workerParams} />
        </div>
      </Modal>
    );

    const loadingMarkup = loading && <CircularProgress />;
    const workersTableMarkup = !loading &&
      workers && (
        <Scrollbars style={{ height: 350 }}>
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
                      <Button
                        onClick={this.openParamsModal(worker.params).bind(this)}
                      >
                        Show Params
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbars>
      );

    return (
      <>
        {paramsModal}
        <Grid container justify="center" spacing={24} direction="column">
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

export default withStyles(styles)(WorkersTab);
