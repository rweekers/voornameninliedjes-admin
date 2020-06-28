import React from 'react';
import { Switch, Route } from 'react-router';
import { PrivateRoute } from './PrivateRoute';
import { ConnectedRouter } from 'connected-react-router';
import LoginPage from './LoginPage';
import { HomePage } from './HomePage';
import SongDetail from './SongDetail';
import SongList from './SongList';
import { About } from './About';
import { UserContext } from '../user-context';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SearchAppBar from './SearchAppBar';
import { history } from '../configureStore';

const styles = theme => ({
  root: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    '& a': {
      textDecoration: 'none',
    },
  },
  login: {
    textAlign: 'right',
    padding: '0 1% 0 0',
    '& p': {
      display: 'inline',
    },
  },
  button: {
    color: 'white'
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);

    this.logout = () => {
      this.setState(state => ({
        loggedIn: false
      }));
    };

    this.login = () => {
      this.setState(state => ({
        loggedIn: true
      }));
    };

    this.setUser = (newUser) => {
      this.setState(state => ({
        user: newUser
      }));
    }

    this.state = {
      user: {},
      loggedIn: false,
      logout: this.logout,
      login: this.login,
      setUser: this.setUser,
      text: '☰'
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'))
    const loggedIn = user !== null

    this.setState({
      user: user,
      loggedIn: loggedIn
    });
  }

  changeText = () => {
    if (this.state.text === '☰') {
      this.setState({ text: 'x' });
    } else {
      this.setState({ text: '☰' });
    }
  }

  handleLogin() {
    this.setState({ loggedIn: true })
  }

  uitloggen() {
    history.push('/login');
  }

  render() {
    const user = this.state.user;
    const loggedIn = this.state.loggedIn;

    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <UserContext.Provider value={this.state}>
          <ConnectedRouter history={history}>
            <div>
              <SearchAppBar loggedOut={!this.state.loggedIn} />
              <div className={classes.login} hidden={!this.state.loggedIn}>
                {loggedIn && user !== null && <div><Typography variant="subtitle1" gutterBottom>Ingelogd als {user.username} <Button className={classes.button} onClick={this.uitloggen}>Uitloggen</Button></Typography></div>}
              </div>
              <Switch>
                <PrivateRoute exact path="/about" component={About} />
                <PrivateRoute exact path="/songs" component={SongList} />
                <PrivateRoute exact path="/" component={HomePage} />
                <PrivateRoute exact path="/songs/:id" component={SongDetail} />
                <PrivateRoute exact path="/songs/new" component={SongDetail} />
                <Route path="/login" render={(props) => <LoginPage {...props} action={this.handleLogin} />} />
              </Switch>
            </div>
          </ConnectedRouter>
        </UserContext.Provider>
      </div>
    );
  }
}

App.contextType = UserContext;

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
