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
      name: null,
      meta: { title: null },
      styles: {
        transition: null,
        header: {
          position: 'none',
          href: '/',
        }
      }
    };
    this._currentUserInformation = null;

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
        case types.GET_CURRENT_USER_INFORMATION:
          this._currentUserInformation = action.currentUserInformation;
          this._updatePageInformation({
            name: pages.BUCKET,
            meta: { title: 'Bucket' },
          });
          this.dispatchChange();
          break;
      }
    });
  }

  // routing
  _routes() {
    this.on(UPDATE_PAGE, (pathname) => {
      switch (pathname) {
        default:
          this._updatePageInformation({
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


  // method for app
  _isLoggedIn() {
    return (this._currentUserInformation !== null);
  }

  _updatePageInformation(pageInformation) {
    this._pageInformation = Object.assign({}, this._pageInformation, pageInformation);
  }
}
