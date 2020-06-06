import { Dispatch } from '../reducers/types';
import { store } from '../../index';

export const FETCH_ITEM_DATA_BEGIN = 'FETCH_ITEM_DATA_BEGIN';
export const FETCH_ITEM_DATA_SUCCESS = 'FETCH_ITEM_DATA_SUCCESS';
export const FETCH_ITEM_DATA_ERROR = 'FETCH_ITEM_DATA_ERROR';
export const FETCH_MARKET_DATA_BEGIN = 'FETCH_MARKET_DATA_BEGIN';
export const FETCH_MARKET_DATA_SUCCESS = 'FETCH_MARKET_DATA_SUCCESS';
export const FETCH_MARKET_DATA_ERROR = 'FETCH_MARKET_DATA_ERROR';
export const REMOVE_ITEM = 'REMOVE_ITEM';

export function removeTag(tag:string) {
  return {
    type: REMOVE_ITEM,
    payload: tag
  }
}

export function addTag(tag:string) {
  return async (dispatch: any) => {
    const state:any = store.getState();
    if (!state.items.itemList.find((i:any) => i.tag === tag)) {
      dispatch(getMarketData(tag));
      dispatch(getItemData(tag));
    }
  }
}

export function getMarketData(tag:string) {
  return async (dispatch: Dispatch) => {
    const id = Math.random();
    dispatch({
      type: FETCH_MARKET_DATA_BEGIN,
      payload: {
        id,
        tag,
      }
    });

    fetch(`https://www.albion-online-data.com/api/v2/stats/prices/${ tag }`,
      {
        "credentials":"omit",
        "headers":
          {"accept":"*/*",
          "accept-language":"pt-BR,pt;q=0.9,en-GB;q=0.8,en;q=0.7,pt-PT;q=0.6,en-US;q=0.5",
          "sec-fetch-dest":"empty",
          "sec-fetch-mode":"cors",
          "sec-fetch-site":"cross-site"},
          "referrer":"https://www.albiononline2d.com/en/item/cat/melee",
          "referrerPolicy":"no-referrer-when-downgrade",
          "body":null,
          "method":"GET",
          "mode":"cors"
      }
    )
    .then(res => res.json())
    .then(data => dispatch({
      type: FETCH_MARKET_DATA_SUCCESS,
      payload: {
        id,
        tag,
        data
      }
    }))
    .catch(error => {
      console.error(error);
      dispatch({
        type: FETCH_MARKET_DATA_ERROR,
        payload: {
          id,
          tag,
          error
        }
      })
    });
  }
}

export function getItemData(tag:string) {
  return async (dispatch: Dispatch) => {
    const id = Math.random();
    dispatch({
      type: FETCH_ITEM_DATA_BEGIN,
      payload: {
        id,
        tag,
      }
    });

    fetch(`https://gameinfo.albiononline.com/api/gameinfo/items/${ tag }/data`,
    {
      "credentials":"include",
      "headers":{
        "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language":"pt-BR,pt;q=0.9,en-GB;q=0.8,en;q=0.7,pt-PT;q=0.6,en-US;q=0.5",
        "cache-control":"max-age=0",
        "sec-fetch-dest":"document",
        "sec-fetch-mode":"navigate",
        "sec-fetch-site":"none",
        "sec-fetch-user":"?1",
        "upgrade-insecure-requests":"1"
      },
      "referrerPolicy":"no-referrer-when-downgrade",
      "body":null,
      "method":"GET",
      "mode":"cors"
    })
    .then(res => res.json())
    .then(data => dispatch({
      type: FETCH_ITEM_DATA_SUCCESS,
      payload: {
        id,
        tag,
        data
      }
    }))
    .catch(error => {
      console.error(error);
      dispatch({
        type: FETCH_ITEM_DATA_ERROR,
        payload: {
          id,
          tag,
          error
        }
      })
    });
  }
}

