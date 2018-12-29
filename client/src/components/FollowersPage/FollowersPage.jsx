import React from "react";
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
import BlockIcon from "@material-ui/icons/Block";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import Star from "@material-ui/icons/Star";
import StarBorder from "@material-ui/icons/StarBorder";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  avatar: {
    width: "40px",
    height: "40px"
  }
});

class FollowersPage extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      followers: [],
      message: null
    };
  }

  componentDidMount() {
    this.fetchFollowers();
  }

  fetchFollowers() {
    this.setState({ loading: true });

    fetch("http://localhost:3000/followers/")
      .then(res => {
        return res.json();
      })
      .then(response => {
        this.setState({
          loading: false,
          followers: response.data.followers,
          totalCount: response.data.totalCount
        });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  unfollow(id) {
    return () =>
      fetch("http://localhost:3000/followers/", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      })
        .then(response => {
          this.setState({
            message: "User unfollowed"
          });
        })
        .catch(error => {
          console.log(error);
        });
  }

  follow(id) {
    return () =>
      fetch("http://localhost:3000/followers/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      })
        .then(response => {
          this.setState({
            message: "User followed"
          });
        })
        .catch(error => {
          console.log(error);
        });
  }

  block(id) {
    return () =>
      fetch("http://localhost:3000/blocked-users/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      })
        .then(response => {
          this.setState({
            message: "User blocked"
          });
        })
        .catch(error => {
          console.log(error);
        });
  }

  unblock(id) {
    return () =>
      fetch("http://localhost:3000/blocked-users/", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      })
        .then(response => {
          this.setState({
            message: "User unblocked"
          });

          this.fetchFollowers();
        })
        .catch(error => {
          console.log(error);
        });
  }

  addToFavorite(id) {
    return () =>
      fetch("http://localhost:3000/favorites/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({id})
      })
        .then(response => {
          this.setState({
            message: "User added to favorites"
          });

          this.fetchFollowers();
        })
        .catch(error => {
          console.log(error);
        });
  }

  removeFromFavorite(id) {
    return () =>
      fetch("http://localhost:3000/favorites/", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({id})
      })
        .then(response => {
          this.setState({
            message: "User removed from favorites"
          });

          this.fetchFollowers();
        })
        .catch(error => {
          console.log(error);
        });
  }

  handleSnackbarClose() {
    this.setState({
      message: null
    });
  }

  render() {
    const { followers, loading, message, totalCount } = this.state;
    const { classes } = this.props;
    const successActionMessageMarkup = (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={this.state.message !== null}
        autoHideDuration={1000}
        onClose={this.handleSnackbarClose.bind(this)}
        message={this.state.message}
      />
    );

    const loadingMarkup = loading && <CircularProgress thickness={7} />;

    const followersMarkup = !loading && (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {followers.map(follower => {
            return <TableRow key={follower.id}>
                <TableCell>
                  <img className={classes.avatar} src={follower.imageSrc} />
                </TableCell>
                <TableCell>{follower.username}</TableCell>
                <TableCell>
                  <Button className={classes.button} variant="contained" color="primary" onClick={follower.isFollowing ? this.unfollow(follower.id) : this.follow(follower.id)}>
                    {follower.isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                  <Tooltip title="Will unfollow user and add it to blocked list. So he will never be followed with our jobs" placement="left">
                    <Button onClick={follower.isBlocked ? this.unblock(follower.id) : this.block(follower.id)} variant="contained" color="secondary">
                      {follower.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </Tooltip>
                  <Button onClick={follower.isFavorite ? this.removeFromFavorite(follower.id) : this.addToFavorite(follower.id)} variant="contained" color="secondary">
                    {follower.isFavorite ? <Star /> : <StarBorder />}
                  </Button>
                </TableCell>
              </TableRow>;
          })}
        </TableBody>
      </Table>
    );

    let title = "Followers Users";

    if (totalCount) {
      title += ` (${totalCount})`;
    }

    return (
      <Grid container justify="center" spacing={24} direction="column">
        <Grid item>
          <Card>
            <CardHeader title={title} />
            <CardContent>
              {followersMarkup}
              {loadingMarkup}
            </CardContent>
          </Card>
        </Grid>
        {successActionMessageMarkup}
      </Grid>
    );
  }
}

export default withStyles(styles)(FollowersPage);
