import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import items from './items';
import options from './options';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    items,
    options
  });
}
