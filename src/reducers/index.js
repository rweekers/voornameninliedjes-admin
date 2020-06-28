import { combineReducers } from 'redux';
import { songs, searchedSongs, isFetching, isFetchingSearch, errorMessage, searchErrorMessage } from './songs';
import { connectRouter } from 'connected-react-router'
import visibilityFilter from './visibilityFilter';
import * as fromSongs from './songs';

export const voornameninliedjesApp = (history) => combineReducers({
  songs: songs,
  searchedSongs: searchedSongs,
  visibilityFilter: visibilityFilter,
  isFetching: isFetching,
  isFetchingSearch: isFetchingSearch,
  errorMessage: errorMessage,
  searchErrorMessage: searchErrorMessage,
  router: connectRouter(history)
});

export default voornameninliedjesApp;

export const getIsFetching = (state) => {
  return fromSongs.getIsFetching(state)
}

export const getIsFetchingSearch = (state) => {
  return fromSongs.getIsFetchingSearch(state);
}

export const getSongs = (state) => {
  const my_object = fromSongs.getSongs(state);
  // const sliced = my_object.slice(100, 120);

  // return sliced;
  return my_object;
}

export const getSearchedSongs = (state) => {
  return fromSongs.getSearchedSongs(state);
}

export const getErrorMessage = (state) => {
  return fromSongs.getErrorMessage(state);
}

export const getSearchErrorMessage = (state) => {
  return fromSongs.getSearchErrorMessage(state);
}