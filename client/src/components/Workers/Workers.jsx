import React from "react";
import socketIOClient from "socket.io-client";

import { ExpandLess, ExpandMore, Add } from "@material-ui/icons";
import { Tab, Tabs } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import WorkersTab from "../WorkersTab";
import StatusBar from "./components/StatusBar";
import Modal from "@material-ui/core/Modal";
import RunJobModal from "./components/RunJobModal";

const styles = theme => ({
  actionBar: {
    width: "100%",
    position: "fixed",
    bottom: 0,
    left: 0,
    background: "#ffffff"
  },

  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.2,
    background: "#000000",
    "z-index": "-1"
  },
  minimized: {
    height: 0
  },
  maximized: {
    height: "400px"
  },
  actionBarMinimized: {
    position: "fixed",
    bottom: 0,
    right: 0
  },
  actionBarMaximized: {
    position: "absolute",
    right: 0,
    "z-index": 1
  },
  tabs: {
    flexGrow: 1,
    width: "100%"
  }
});

const TABS = {
  active: 0,
  waiting: 1,
  succeeded: 2,
  failed: 3,
  delayed: 4
};

const refreshEvents = ["created", "failed", "finished", "queued"];

class Workers extends React.Component {
  constructor() {
    super();
    this.endpoint = "http://127.0.0.1:3001";
    this.state = {
      expanded: true,
      selectedTab: TABS.active,
      workers: {},
      loading: false,
      runJobModalOpen: false
    };
  }

  componentDidMount() {
    const socket = socketIOClient(this.endpoint);
    socket.on("job progress", data => {
      const { workers } = this.state;

      if (data && refreshEvents.includes(data.event)) {
        this.fetchJobs();
        return;
      }

      if (workers) {
        Object.keys(workers).some(category => {
          const worker = workers[category].find(worker => worker.id == data.id);
          if (worker) {
            worker.lastMessage = data.message;

            return true;
          }
        });

        this.setState({ workers });
      }
    });
    this.fetchJobs();
  }

  fetchJobs() {
    this.setState({ loading: true });

    fetch("http://localhost:3000/workers/group")
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

  toggleDrawer() {
    this.setState({ expanded: !this.state.expanded });
  }

  changeTab(event, value) {
    this.setState({ selectedTab: value });
  }

  openRunJobModal() {
    this.setState({ runJobModalOpen: true });
  }

  closeRunJobModal() {
    this.setState({ runJobModalOpen: false });
  }

  onRun() {
    this.fetchJobs();
    this.closeRunJobModal();
  }

  render() {
    const { classes } = this.props;
    const { expanded, selectedTab, workers, runJobModalOpen } = this.state;

    let containerClasses = [classes.actionBar];
    containerClasses.push(expanded ? classes.maximized : classes.minimized);

    const maximizeMarkup = (
      <ExpandLess onClick={this.toggleDrawer.bind(this)} />
    );

    const minimizeMarkup = (
      <ExpandMore onClick={this.toggleDrawer.bind(this)} />
    );

    const activeRecordsExists = workers.active && workers.active.length > 0;
    const statusBarMarkup = <StatusBar loading={activeRecordsExists} />;

    const actionBar = (
      <div
        className={
          expanded ? classes.actionBarMaximized : classes.actionBarMinimized
        }
      >
        <Add onClick={this.openRunJobModal.bind(this)} />
        {statusBarMarkup}
        {expanded ? minimizeMarkup : maximizeMarkup}
      </div>
    );

    const runJobModal = (
      <Modal open={runJobModalOpen} onClose={this.closeRunJobModal.bind(this)}>
        <RunJobModal onRun={this.onRun.bind(this)} />
      </Modal>
    );

    return (
      <div className={containerClasses.join(" ")}>
        {actionBar}
        {runJobModal}

        <div className={classes.background} />
        <div className={classes.tabs}>
          <Tabs
            value={selectedTab}
            onChange={this.changeTab.bind(this)}
            indicatorColor="primary"
            textColor="primary"
            scrollButtons="auto"
          >
            <Tab label={`Active (${this.getWorkersCount(workers.active)})`} />
            <Tab label={`Waiting (${this.getWorkersCount(workers.waiting)})`} />
            <Tab
              label={`Succeed (${this.getWorkersCount(workers.succeeded)})`}
            />
            <Tab label={`Failed (${this.getWorkersCount(workers.failed)})`} />
            <Tab label={`Delayed (${this.getWorkersCount(workers.delayed)})`} />
          </Tabs>
          {selectedTab === TABS.active && (
            <WorkersTab workers={workers.active} />
          )}
          {selectedTab === TABS.waiting && (
            <WorkersTab workers={workers.waiting} />
          )}
          {selectedTab === TABS.succeeded && (
            <WorkersTab workers={workers.succeeded} />
          )}
          {selectedTab === TABS.failed && (
            <WorkersTab workers={workers.failed} />
          )}
          {selectedTab === TABS.delayed && (
            <WorkersTab workers={workers.delayed} />
          )}
        </div>
      </div>
    );
  }

  getWorkersCount(workers) {
    return workers ? workers.length : 0;
  }
}

export default withStyles(styles)(Workers);
