import React from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';
import withWidth from '@material-ui/core/withWidth';
import { fetchSongs, navigateTo } from '../actions';
import { getIsFetching, getSongs, getErrorMessage } from '../reducers';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CustomSnackBar from './CustomSnackBar';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  newSong: {
    marginTop: '2em',
    width: '60%',
  },
  songs: {
    marginTop: '3em',
  },
  button: {
    margin: '0.2em',
  },
  card: {
    height: 400,
  },
  media: {
    height: 280,
    backgroundPosition: '0% 1%',
  },
  progressWrapper: {
    marginTop: '5%',
    textAlign: 'center',
  },
  progress: {
    margin: 10,
    display: 'inline-block',
  },
});

class SongList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "a",
      status: ['SHOW', 'IN_PROGRESS', 'TO_BE_DELETED'],
    };
  }

  updateInput = input => {
    this.setState({ input });
  };

  componentDidMount() {
    this.props.fetchSongs(this.state.input, this.state.status);
  }

  handleFilter = (character) => {
    const filterCharacter = character.value.toLowerCase();
    this.setState({ input: filterCharacter }, this.fetchSongs);
  }

  fetchSongs() {
    this.props.fetchSongs(this.state.input, this.state.status);
  }

  newSong = () => {
    this.props.navigateTo(`/songs/new`);
  }

  selectSong = (songId) => {
    this.props.navigateTo(`/songs/${songId}`);
  }

  handleChange = (event) => {
    if (event.target.checked) {
      this.setState({
        status: [...this.state.status, event.target.name]
      }, this.fetchSongs);
    } else {
      var array = [...this.state.status];
      var index = array.indexOf(event.target.name)
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({
          status: array,
        }, this.fetchSongs);
      }
    }
  }

  render() {
    const { isFetching, songs, errorMessage, classes } = this.props;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    if (isFetching && !songs.length) {
      return <div id="progressWrapper" className={classes.progressWrapper}>
        <CircularProgress id="progress" className={classes.progress} size="6rem" thickness={4.5} />
      </div>;
    }

    if (errorMessage && !songs.length) {
      return (
        <div>
          <p>{errorMessage}</p>
        </div>
      );
    }

    return (
      <div>
        <Hidden smDown>
          <div className={classes.root}>
            {
              alphabet.match(/.{1,13}/g).map(a =>
                <ButtonGroup key={a} size="large" variant="contained" color="primary" aria-label="contained primary button group">
                  {a.split("").map((value, index) =>
                    <Button key={index} className={classes.button} color={this.state.input === value ? "secondary" : "primary"} onClick={this.handleFilter.bind(this, { value })}>{value}</Button>
                  )}
                </ButtonGroup>
              )}
          </div>
        </Hidden>
        <Hidden mdUp xsDown>
          <div className={classes.root}>
            {
              alphabet.match(/.{1,9}/g).map(a =>
                <ButtonGroup key={a} size="large" variant="contained" color="primary" aria-label="contained primary button group">
                  {a.split("").map((value, index) =>
                    <Button key={index} className={classes.button} color={this.state.input === value ? "secondary" : "primary"} onClick={this.handleFilter.bind(this, { value })}>{value}</Button>
                  )}
                </ButtonGroup>
              )}
          </div>
        </Hidden>
        <Hidden smUp>
          <div className={classes.root}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.input}
              style={{ width: 100, background: 'white' }}
            >
              {alphabet.split("").map((value, index) =>
                <MenuItem key={index} value={value} onClick={this.handleFilter.bind(this, { value })}>{value}</MenuItem>
              )}
            </Select>
          </div>
        </Hidden>
        <div className={classes.root}>
          <FormGroup row>
            <FormControlLabel
              control={<Switch checked={this.state.status.includes('SHOW')} onChange={this.handleChange} name="SHOW" />}
              label="Actieve nummers"
            />
            <FormControlLabel
              control={<Switch checked={this.state.status.includes('IN_PROGRESS')} onChange={this.handleChange} name="IN_PROGRESS" />}
              label="Nummers in bewerking"
            />
            <FormControlLabel
              control={<Switch checked={this.state.status.includes('TO_BE_DELETED')} onChange={this.handleChange} name="TO_BE_DELETED" />}
              label="Nummers te verwijderen"
            />
          </FormGroup>
        </div>
        <div>
          <Grid item xs={12}>
            <Button id="newSong" className={classes.newSong} variant="contained" color="primary" onClick={this.newSong}>
              Nieuw nummer invoeren
                                </Button>
          </Grid>
          <CustomSnackBar
            handleClose={this.handleClose}
            open={this.state.open}
            messageText={this.state.messageText}
            variant={this.state.messageType}
          />
        </div>
        <div className={classes.songs}>
          {isFetching && songs.length && <Grid item xs={12}>
            <LinearProgress />
          </Grid>}
          <Grid container spacing={3}>
            {songs && songs.length > 0 && songs.map((song, index) =>
              <Grid key={song.id} item xs={12} sm={6} md={4} lg={3}>
                <Card className={classes.card} onClick={event => { this.selectSong(song.id) }}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={song.artistImage}
                      title={song.artist}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {song.artist} - {song.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {song.background}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            )}
            {isFetching &&
              <Grid item xs={12}>
                <div id="progressWrapper" className={classes.progressWrapper}>
                  <CircularProgress id="progress" className={classes.progress} size="6rem" thickness={4.5} />
                </div>
              </Grid>
            }
            {!isFetching && songs && songs.length === 0 &&
              <Grid item xs={12}>
                <h2>Geen nummers gevonden beginnend met de letter {this.state.input}.</h2>
              </Grid>
            }
          </Grid>
        </div>
      </div>
    )
  }
}

SongList.propTypes = {
  width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']).isRequired,
  errorMessage: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  fetchSongs: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { params }) => {
  //   const filter = params.filter || 'all';
  return {
    isFetching: getIsFetching(state),
    songs: getSongs(state),
    errorMessage: getErrorMessage(state),
  };
};

SongList = connect(
  mapStateToProps,
  { fetchSongs, navigateTo }
)(SongList);

export default withWidth()(withStyles(styles)(SongList));
