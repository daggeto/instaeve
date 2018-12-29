import React from "react";
import { TextField } from "@material-ui/core";

class SyncFollowingJobForm extends React.Component {
  constructor() {
    super();

    this.state = {
      formParams: {
        username: ""
      }
    };
  }

  handleChange(name) {
    return event => {
      const { onJobParamsChanged } = this.props;

      this.setState(
        {
          formParams: {
            [name]: event.target.value
          }
        },
        () => {
          onJobParamsChanged &&
            onJobParamsChanged("SyncFollowingJob", this.state.formParams);
        }
      );
    };
  }
  render() {
    return (
      <TextField
        id="username"
        label="username"
        value={this.state.formParams.username}
        onChange={this.handleChange("username").bind(this)}
        margin="normal"
      />
    );
  }
}

export default SyncFollowingJobForm;
