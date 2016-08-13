import React from 'react';
import ReactDOM from 'react-dom';

import logger from './utils/logger';
import { isMobileUI } from './utils/is-mobile-ui';
import { loadStylesheet } from './utils/load-stylesheet';
import { dispatch } from './libs/app-dispatcher';
import EventRouter from './router/event-router';

import DesktopStore from './stores/desktop/store';
import DesktopContainer from './components/desktop/container';

import MobileStore from './stores/mobile/store';
import MobileContainer from './components/mobile/container';


window.addEventListener('popstate', (event) => {
  dispatch({
    type: 'UI_CHANGE_HISTORY',
    pathname: location.pathname
  });
});

window.addEventListener('load', () => {
  logger.info(`Start manege app at ${new Date()}`);

  new EventRouter();

  if (isMobileUI()) {
    const store = new MobileStore();

    loadStylesheet('mobile/index.css');
    ReactDOM.render(<MobileContainer store={store} />, document.querySelector('#app'));
  } else {
    const store = new DesktopStore();

    loadStylesheet('desktop/index.css');
    ReactDOM.render(<DesktopContainer store={store} />, document.querySelector('#app'));
  }
});
