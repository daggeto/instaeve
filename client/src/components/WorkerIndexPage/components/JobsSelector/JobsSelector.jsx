import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

export default class JobsSelector extends React.Component {
  constructor() {
    super();
    this.state = {
      jobClassName: null
    };
  }

  handleChange(changes) {
    const {
      target: { value }
    } = changes;

    this.setState({ jobClassName: value });
  }

  render() {
    return (
      <>
        <Select
          value={this.state.jobClassName}
          onChange={this.handleChange.bind(this)}
          inputProps={{ name: "jobClassName", id: "job" }}
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
        </Select>
      </>
    );
  }
}
