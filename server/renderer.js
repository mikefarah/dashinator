import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import configureStore from '../common/store/configureStore';
import App from '../common/containers/App';

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Dashboard Dashinator Style</title>
        <link rel="stylesheet" href="/application.css">
        <link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">
        <script src="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
      </head>
      <body style='margin: 0px'>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
    `;
}

const handleRender = currentStateFunc => (req, res) => {
  const currentState = currentStateFunc();
  const store = configureStore(currentState);

  const html = renderToString(
    <Provider store={ store }>
      <App />
    </Provider>
  );

  const finalState = store.getState();

  res.send(renderFullPage(html, finalState));
};

module.exports = handleRender;
