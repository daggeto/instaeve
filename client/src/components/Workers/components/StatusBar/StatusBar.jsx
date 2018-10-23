import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import { Lens } from "@material-ui/icons";
import "./style.css";

const styles = theme => ({
  loadingIcon: {
    color: green["500"]
  },
  blinker: {
    animation: "blinker 0.5s cubic-bezier(.5, 0, 1, 1) infinite alternate"
  }
});

class StatusBar extends React.Component {
  constructor() {
    super();
  }
  render() {
    const { classes, loading } = this.props;
    const classNames = [classes.loadingIcon];

    if (loading) {
      classNames.push(classes.blinker);
    }

    return <Lens className={classNames.join(" ")} />;
  }
}

export default withStyles(styles)(StatusBar);
