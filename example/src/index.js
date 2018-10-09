// libs
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import store from './config/redux/store';
import actions from './app/actions/user/';

// components
import App from './app/components/App';

// polyfills
import './config/polyfills/polyfills';

const token = localStorage.getItem('token');

if (token) {
  store.dispatch(actions.validateToken()).then((data) => {
    if (!data || !data.validateToken.valid) localStorage.removeItem('token');
  });
} else {
  store.dispatch(actions.validateNoToken());
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
