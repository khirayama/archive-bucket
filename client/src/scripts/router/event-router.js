import { subscribe } from '../libs/app-dispatcher';
import {
  changeHistory,
  getCurrentUserInformation,
} from '../actions/app-action-creators';


export default class EventRouter {
  constructor() {
    subscribe((event) => {
      switch (event.type) {
        case 'UI_START_APP':
          getCurrentUserInformation(event.pathname);
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
