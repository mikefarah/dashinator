import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from '../common/store/configureStore'
import App from '../common/containers/App'
import io from 'socket.io-client'

const socket = io.connect(`${location.protocol}//${location.host}`);

socket.on('disconnect', data => {
  store.dispatch({
    type: 'updateConnection',
    status: 'disconnected'
  })
})
socket.on('action', action => {
  store.dispatch(action)
  store.dispatch({
    type: 'updateConnection',
    status: 'connected'
  })
});

const preloadedState = window.__PRELOADED_STATE__
const store = configureStore(preloadedState)
const rootElement = document.getElementById('app')

render(<Provider store={ store }>
         <App />
       </Provider>,
  rootElement
)