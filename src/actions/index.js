import { normalize } from 'normalizr';
import * as schema from './schema';
import { push } from 'connected-react-router';
import { getIsFetching } from '../reducers';
import { songService } from '../services/song.service';

export const fetchSongs = (firstCharacter, state) => (dispatch, getState) => {
  if (getIsFetching(getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: 'FETCH_SONGS_REQUEST'
  });

  return songService.getByFirstCharacterAndStatus(firstCharacter, state).then(
    response => {
      dispatch({
        type: 'FETCH_SONGS_SUCCESS',
        response: normalize(response, schema.songs)
      });
    },
    error => {
      dispatch({
        type: 'FETCH_SONGS_FAILURE',
        message: error.message || 'Something went wrong.',
      });
    }
  );
}

export const navigateTo = (targetPage) => (dispatch, getState) => {
  dispatch(push(targetPage));
};

export const searchSongs = (query) => (dispatch, getState) => {
  dispatch({
    type: 'SEARCH_SONGS_REQUEST'
  });

  return songService.getByFirstCharacterAndStatus(query, ['SHOW', 'IN_PROGRESS', 'TO_BE_DELETED']).then(
    response => {
      dispatch({
        type: 'SEARCH_SONGS_SUCCESS',
        response: normalize(response, schema.songs)
      });
    },
    error => {
      dispatch({
        type: 'SEARCH_SONGS_FAILURE',
        message: error.message || 'Something went wrong searching songs.',
      });
    }
  );
}