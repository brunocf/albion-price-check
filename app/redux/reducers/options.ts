import {
  SET_OPTION,
  cities
} from '../actions/options';

const initialState:any = (() => {
  const state:any = {};
  cities.forEach(c => state[c.key] = localStorage.getItem(c.key) || 'true');
  return state;
})();

export default function counter(state = initialState, action: any) {
  switch (action.type) {
    case SET_OPTION: {
      const {
        key, value
      } = action.payload;
      state = {...state};
      state[key] = value;
      localStorage.setItem(key, value);
      return state;
    }
    default:
      return state;
  }
}
