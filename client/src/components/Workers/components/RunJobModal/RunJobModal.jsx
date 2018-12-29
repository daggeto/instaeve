import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button
} from "@material-ui/core";
import {LikeAndFollowTopJobForm, SyncFollowersJobForm, SyncFollowingJobForm } from "../";

const styles = theme => ({
  modal: {
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%)`,
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5]
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

const Jobs = {
  LikeAndFollowTopJob: {
    name: "Like and Follow top photos",
    component: LikeAndFollowTopJobForm
  },
  SyncFollowersJob: {
    name: "Sync followers",
    component: SyncFollowersJobForm
  },
  SyncFollowingJob: {
    name: "Sync followings",
    component: SyncFollowingJobForm
  }
};

class RunJobModal extends React.Component {
  constructor() {
    super();

    this.state = { jobName: "LikeAndFollowTopJob", jobsParams: {} };
  }

  onJobParamsChanged(jobName, params) {
    console.log(params);
    const { jobsParams } = this.state;
    jobsParams[jobName] = params;

    this.setState(jobsParams);
  }

  run() {
    const { jobName, jobsParams } = this.state;

    fetch("http://localhost:3000/workers/run", {
      method: "POST",
      mode: "cors",
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ jobClassName: jobName, ...jobsParams[jobName] })
    })
      .then(response => {
        this.props.onRun();
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  render() {
    const { classes } = this.props;
    const { jobName } = this.state;

    const jobsMenuItemsMarkup = Object.keys(Jobs).map(jobName => {
      return (
        <MenuItem key={jobName} value={jobName}>
          {Jobs[jobName].name}
        </MenuItem>
      );
    });

    const SelectedJobComponent = Jobs[jobName] && Jobs[jobName].component;
    const selectedJobComponentMarkup = SelectedJobComponent && (
      <SelectedJobComponent
        onJobParamsChanged={this.onJobParamsChanged.bind(this)}
      />
    );

    return (
      <div className={classes.modal}>
        <Card>
          <CardHeader title="Run job" />
          <CardContent>
            <Paper className={classes.paper}>
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  Select job:
                  <Select
                    value={this.state.jobName}
                    onChange={this.jobNameChange.bind(this)}
                    inputProps={{ name: "jobName", id: "job-name" }}
                  >
                    {jobsMenuItemsMarkup}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  {selectedJobComponentMarkup}
                </Grid>
              </Grid>
            </Paper>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={this.run.bind(this)}>
              Run
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }

  jobNameChange(changes) {
    const {
      target: { value }
    } = changes;

    this.setState({ jobName: value });
  }
}

export default withStyles(styles)(RunJobModal);
