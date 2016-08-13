import { subscribe } from '../libs/app-dispatcher';
import { changeHistory } from '../actions/app-action-creators';


export default class EventRouter {
  constructor() {
    subscribe((event) => {
      switch (event.type) {
        case 'UI_START_APP':
          // initialize
          break;
        case 'UI_CHANGE_HISTORY':
          changeHistory(event.pathname);
          break;
        default:
          break;
      }
    });
  }
}
