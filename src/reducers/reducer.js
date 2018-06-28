import { combineReducers } from 'redux';
import * as init from './defaults';

function app(state = init.app, action) {
  switch(action.type) {

    case 'TEST':
      return Object.assign(
        {}, state, { app: action.data }
      )

    default:
      return state
  }
}

export default combineReducers({
  app
});