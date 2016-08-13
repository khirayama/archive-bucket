import { dispatch } from '../libs/app-dispatcher';
import { actionTypes as types } from '../constants';


export function changeHistory(pathname) {
  dispatch({
    type: types.CHANGE_HISTORY,
    pathname: pathname,
  });
}
