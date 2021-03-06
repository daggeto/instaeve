import React from "react";
import { TextField } from "@material-ui/core";

class LikeAndFollowTopJobForm extends React.Component {
  constructor() {
    super();

    this.state = {
      formParams: {
        hashtag: ""
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
            onJobParamsChanged("LikeAndFollowTopJob", this.state.formParams);
        }
      );
    };
  }

  render() {
    return (
      <TextField
        id="hashtag"
        label="Hashtag"
        value={this.state.formParams.hashtag}
        onChange={this.handleChange("hashtag").bind(this)}
        margin="normal"
      />
    );
  }
}

export default LikeAndFollowTopJobForm;
