import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { RouterProvider, routerForBrowser } from 'redux-little-router';
import io from 'socket.io-client';
import configureStore from '../common/store/configureStore';
import App from '../common/containers/App';
import routes from '../common/routes';

const preloadedState = window.__PRELOADED_STATE__;

const {
  routerEnhancer,
  routerMiddleware,
} = routerForBrowser({ routes });

const store = configureStore(preloadedState, routerEnhancer, routerMiddleware);

const socket = io.connect(`${location.protocol}//${location.host}`);

socket.on('disconnect', () => {
  store.dispatch({
    type: 'updateConnection',
    status: 'disconnected',
  });
});
socket.on('action', (action) => {
  store.dispatch(action);
  store.dispatch({
    type: 'updateConnection',
    status: 'connected',
  });
});

const rootElement = document.getElementById('app');

render(
  <Provider store={ store }>
    <RouterProvider store={ store }>
      <App />
    </RouterProvider>
  </Provider>,
  rootElement
);
