import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import voornameninliedjesApp from './reducers';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const configureStore = () => {
  const reactRouterMiddleware = routerMiddleware(history);
  const middlewares = [thunk, reactRouterMiddleware];
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }

  const devTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__();
  const redux = devTools || compose;

  return createStore(
    voornameninliedjesApp(history),
    compose(applyMiddleware(...middlewares), redux)
  );
};

export default configureStore;