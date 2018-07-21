import React from "react"
import PropTypes from "prop-types"
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { userInfo } from "os";

interface Media {
  id: number;
  media_url: string;
};

interface User {
  biography: string;
  name: string;
  id: number;
  media?: {data: Media[]};
}

interface State {
  accessToken?: string;
  loading: boolean;
  userLoading: boolean;
  me: User;
  user: User;
  username: string;
  errorMessage: string;
};

class Dashboard extends React.Component {
  state: State = {
    accessToken: null,
    loading: false,
    userLoading: false,
    me: null,
    user: null,
    username: '',
    errorMessage: '',
  };

  fbClient = null;

  componentDidMount(){
    window.fbAsyncInit = function() {
      this.fbClient = FB;
      FB.init({
        appId: '230821287649247',
        cookie: true, 
        xfbml: true,
        version: 'v3.0'
      });
  
      // Now that we've initialized the JavaScript SDK, we call
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.
      FB.getLoginStatus(function(response) {
        this.statusChangeCallback(response);
      }.bind(this));
    }.bind(this);
  
    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  };

  render () {
    const {user} = this.state;

    const loadingMarkup = this.state.loading && (
      <CardContent> 
        <CircularProgress />
      </CardContent>
    );

    const loginButton = !this.state.accessToken && (
      <button onClick={this.login.bind(this)}>Login</button>
    );

    const userInfoMarkup = this.state.me && (
        <CardContent>
          <Typography variant="headline" component="h2">
            Hi, welcome {this.state.me.name}
          </Typography>
          <Typography color="textSecondary">
            Bio: {this.state.me.biography}
          </Typography>
        </CardContent>
    );

    const usernameMarkup = (
      <TextField
          id="name"
          label="Name"
          value={this.state.username}
          onChange={this.handleChange('username')}
          margin="normal"
        />
    );

    const userLoadingMarkup = this.state.userLoading && (<CircularProgress />);

    const userImagesMarkup = user && (
      <GridList cellHeight={180} >
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div">{user.name}</ListSubheader>
        </GridListTile>
        {user.media.data.map(media => (
          <GridListTile key={media.media_url}>
            <img src={media.media_url} />
          </GridListTile>
        ))}
      </GridList>
    );

    return (
      <React.Fragment>
        {loginButton}
        <Card>
          {loadingMarkup}
          {userInfoMarkup}
        </Card>
        <Card>
          <CardContent>
            {usernameMarkup}
            {this.state.errorMessage}
          </CardContent>
          <CardActions>
              <Button 
                // disabled={this.state.userLoading} 
                variant="contained" 
                color="primary"
                onClick={this.fetchUser.bind(this)}>
                  Fetch
              </Button>
            </CardActions>
        </Card>
        <Card>
          <CardContent>
            {userImagesMarkup}
            {userLoadingMarkup}
          </CardContent>
        </Card>
      </React.Fragment>
    );
  }

  private fetchUser() {
    const {username} = this.state;
    this.setState({userLoading: true});
    
    if (username.length === 0) {
      this.setState({errorMessage: 'User name required', userLoading: false});
      return;
    }

    const userCallback = async (response) => {
      console.log(response);
      let newState = {userLoading: false};

      if (response.error) {
        newState.errorMessage = response.error.message;
      }

      newState.user = response.business_discovery;
      this.setState(newState);

      console.log(this.state);
    };

    this.fbRequest('business_discovery.username(' + username + '){name,media{media_url, permalink}}', userCallback.bind(this));
  }

  private fbRequest(fields, callback) {
    window.FB.api('/17841400068317427', {fields: fields}, callback);
  }

  private handleChange = function(fieldName) {
    return event => {
      this.setState({
        [fieldName]: event.target.value,
      });
    };
  };

  private statusChangeCallback(response) {
    console.log(response);
    
    if (response.status === 'connected') {
      this.setState({accessToken: response.authResponse.accessToken, loading: true});
      
      window.FB.api('/17841400068317427', {fields: ['biography', 'name']}, function(response) {
        this.setState({me: response, loading: false});

      }.bind(this));
    } 
  }

  private login() {
    this.setState({showResults: true});

    window.FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        this.setState({accessToken: response.authResponse.accessToken});
        
        window.FB.api('/17841400068317427', {fields: ['biography', 'name']}, function(response) {
          console.log(response);
        });
      } 
      
      this.setState({showResults: false});
      console.log(response);
    }.bind(this));

    // window.FB.login(function(response) {
    //   window.FB.api('/17841400068317427', {fields: 'biography'}, function(response) {
    //     console.log(response);
    //   });

    //   if (response.authResponse) {
    //   console.log('Welcome!  Fetching your information.... ');
      
    //   } else {
    //   console.log('User cancelled login or did not fully authorize.');
    //   }
    // });
  }
}

Dashboard.propTypes = {
  greeting: PropTypes.string
};
export default Dashboard
