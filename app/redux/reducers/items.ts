import {
  FETCH_ITEM_DATA_BEGIN,
  FETCH_ITEM_DATA_SUCCESS,
  FETCH_ITEM_DATA_ERROR,
  FETCH_MARKET_DATA_BEGIN,
  FETCH_MARKET_DATA_SUCCESS,
  FETCH_MARKET_DATA_ERROR,
  REMOVE_ITEM
} from '../actions/items';

const initialState = {
  itemData: Array(),
  itemList: Array()
}

export default function counter(state = initialState, action: any) {
  let itemIdx;
  switch (action.type) {
    case REMOVE_ITEM: {
      state = {...state};
      state.itemList = state.itemList.filter(i => i.tag !== action.payload);
      return state;
    }
    case FETCH_ITEM_DATA_BEGIN:
      state = {...state}
      state.itemData = [
        {
          ...action.payload,
          isLoading: true,
          error: null,
          data: null
        },
        ...state.itemData
      ];
      return state;
    case FETCH_ITEM_DATA_SUCCESS:
      itemIdx = state.itemData.findIndex(i => i.id === action.payload.id);
      if (itemIdx === -1 ) return state;

      state = {...state};
      state.itemData = [...state.itemData];

      state.itemData[itemIdx] = {
        ...state.itemData[itemIdx],
        isLoading: false,
        data: action.payload.data
      }

      return state;
    case FETCH_ITEM_DATA_ERROR:
      itemIdx = state.itemData.findIndex(i => i.id === action.payload.id);
      if (itemIdx === -1 ) return state;

      state = {...state};
      state.itemData = [...state.itemData];

      state.itemData[itemIdx] = {
        ...state.itemData[itemIdx],
        isLoading: false,
        error: action.payload.error
      }

      return state;
    case FETCH_MARKET_DATA_BEGIN:
        state = {...state}
        state.itemList = [
          ...state.itemList,
          {
            ...action.payload,
            isLoading: true,
            error: null,
            data: null
          }
        ];
        return state;
    case FETCH_MARKET_DATA_SUCCESS:
      itemIdx = state.itemList.findIndex(i => i.id === action.payload.id);
      if (itemIdx === -1 ) return state;

      state = {...state};
      state.itemList = [...state.itemList];

      state.itemList[itemIdx] = {
        ...state.itemList[itemIdx],
        isLoading: false,
        data: action.payload.data
      }

      return state;
    case FETCH_MARKET_DATA_ERROR:
      itemIdx = state.itemList.findIndex(i => i.id === action.payload.id);
      if (itemIdx === -1 ) return state;

      state = {...state};
      state.itemList = [...state.itemList];

      state.itemList[itemIdx] = {
        ...state.itemList[itemIdx],
        isLoading: false,
        error: action.payload.error
      }

      return state;
    default:
      return state;
  }
}
