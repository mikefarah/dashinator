import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import io from 'socket.io-client';
import configureStore from '../common/store/configureStore';
import App from '../common/containers/App';

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);

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

render(<Provider store={ store }>
         <App />
       </Provider>,
  rootElement
);
