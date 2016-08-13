import { dispatch } from '../libs/app-dispatcher';
import { actionTypes as types } from '../constants';

import CurrentUserInformation from '../resources/current-user-information';


export function changeHistory(pathname) {
  dispatch({
    type: types.CHANGE_HISTORY,
    pathname: pathname,
  });
}

export function getCurrentUserInformation(pathname) {
  CurrentUserInformation.fetch().then((res) => {
    dispatch({
      type: types.GET_CURRENT_USER_INFORMATION,
      currentUserInformation: res.data,
      pathname,
    });
  });
}
