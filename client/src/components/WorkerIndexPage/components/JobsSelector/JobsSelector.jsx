import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

class JobsSelector extends React.Component {
  constructor() {
    super();
    this.state = {
      jobClassName: ""
    };
  }

  handleChange(changes) {
    const {
      target: { value }
    } = changes;
    const { onUpdate } = this.props;

    this.setState({ jobClassName: value });
    onUpdate(value);
  }

  render() {
    const { classes } = this.props;
    return (
      <TextField
        id="select-currency"
        select
        label="Task to run"
        className={classes.textField}
        value={this.state.jobClassName}
        onChange={this.handleChange.bind(this)}
        SelectProps={{ MenuProps: { className: classes.menu } }}
        helperText="Please select task you want to run"
        margin="normal"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="FollowInstagramUserJob">
          FollowInstagramUserJob
        </MenuItem>
        <MenuItem value="UnfollowInstagramUserJob">
          UnfollowInstagramUserJob
        </MenuItem>
        <MenuItem value="LikeAndFollowTopJob">LikeAndFollowTopJob</MenuItem>
        <MenuItem value="SyncFollowersJob">SyncFollowersJob</MenuItem>
      </TextField>
    );
  }
}

function styles(theme) {
  return {
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit
    },
    menu: {}
  };
}

export default withStyles(styles)(JobsSelector);
