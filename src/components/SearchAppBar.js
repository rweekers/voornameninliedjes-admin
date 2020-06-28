import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { searchSongs, fetchSongs, navigateTo } from '../actions';
import { getIsFetchingSearch, getSearchedSongs, getErrorMessage } from '../reducers';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  emptyTitle: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  searchInput: {
    backgroundColor: 'white',
    borderBlockColor: 'white',
    marginRight: '100px',
  },
  inputRoot: {
    color: 'inherit',
  },
  input2: {
    [theme.breakpoints.up('md')]: {
      width: 300,
    },
    [theme.breakpoints.only('md')]: {
      width: 200,
    },
    [theme.breakpoints.down('sm')]: {
      width: 100,
    },
    marginRight: '10px',
  },
  input: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
}));

const SearchAppBar = (props) => {
  const classes = useStyles();
  const [query, setQuery] = useState('');

  const { searchedSongs, isFetchingSearch/*, searchErrorMessage*/ } = props;

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      props.searchSongs(query);
    }, 750);
    return () => clearTimeout(timeOutId);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const select = (event, action) => {
    if (action) {
      setQuery('');
      props.searchSongs('');
      props.navigateTo(`/songs/${action.id}`);
    }
  }

  const filter = (event) => {
    if (event && event) {
      setQuery(event.target.value);
    }
  }

  return (
    <div className={classes.root} hidden={props.loggedOut}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/">
            <Button>Gebruikers</Button>
          </Link>
          <Link to="/songs/">
            <Button>Nummers</Button>
          </Link>
          <Link to="/about/">
            <Button>Over</Button>
          </Link>
          <Typography className={classes.title} variant="h4" noWrap>
            Voornamen in liedjes
          </Typography>
          <div className={classes.emptyTitle} />
          {isFetchingSearch && <div><CircularProgress id="progress" className={classes.progress} color="secondary" size="2rem" thickness={4.5} /></div>}
          <div>
            <Autocomplete
              options={searchedSongs}
              getOptionLabel={option => `${option.artist} - ${option.title}`}
              id="search-song-by-name"
              className={classes.input2}
              onChange={select}
              onInputChange={filter}
              freeSolo
              filterSelectedOptions
              disableClearable
              inputValue={query}
              renderInput={(params) => <TextField className={classes.searchInput} {...params} label="Zoek op een naam..." margin="normal"
              />}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state, { params }) => {
  return {
    isFetchingSearch: getIsFetchingSearch(state),
    searchedSongs: getSearchedSongs(state),
    errorMessage: getErrorMessage(state),
  };
};

export default connect(
  mapStateToProps,
  { fetchSongs, searchSongs, navigateTo }
)(SearchAppBar);