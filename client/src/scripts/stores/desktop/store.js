import config from '../../../config';
import { pages, actionTypes as types } from '../../constants';
import { dispatch, subscribe } from '../../libs/app-dispatcher';
import MicroStore from '../../libs/micro-store';


const UPDATE_PAGE = 'UPDATE_PAGE';

export default class AppStore extends MicroStore {
  constructor() {
    super();

    // application state
    this._pageInformation = {
      name: pages.CREATING_FOR_DESKTOP,
      meta: { title: 'Creating...' },
      styles: {
        transition: null,
      }
    };

    this._routes();
    this._subscribe();
  }

  _updatePage(pathname) {
    this.emit(UPDATE_PAGE, pathname);
  }

  _subscribe() {
    subscribe((action) => {
      switch (action.type) {
        case types.CHANGE_HISTORY:
          this._updatePage(action.pathname);
          this.dispatchChange();
          break;
      }
    });
  }

  // routing
  _routes() {
    this.on(UPDATE_PAGE, (pathname) => {
      switch (pathname) {
        case '/':
          this._pageInformation = Object.assign({}, this._pageInformation, {
            name: pages.LANDING,
            meta: { title: 'Landing' },
            styles: {
              transition: 'fadeInOut',
              header: { position: 'none' },
            },
          });
          this.dispatchChange();
          break;
        default:
          this._pageInformation = Object.assign({}, this._pageInformation, {
            name: pages.NOT_FOUND,
            meta: { title: 'NOT FOUND' },
            styles: {
              header: { position: 'none' },
            }
          });
          this.dispatchChange();
          break;
      }
    });
  }

  getState() {
    return {
      pageInformation: this._pageInformation,
    };
  }
}
