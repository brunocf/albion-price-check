import React, { useState, useEffect } from 'react';
import './Home.css';
import { ipcRenderer } from 'electron';
import { addTag, removeTag } from '../redux/actions/items';
import { connect } from 'react-redux';
import _ from 'lodash';
import Options from './Options';
import { cities } from '../redux/actions/options';
import Tips from './Tips';


const numberFormat = new Intl.NumberFormat('en-US');

function Home(props:any) {
  const {
    dispatch,
    data,
    market,
    options
  } = props;

  const [eventRegistered, setEventRegistered] = useState(false);

  useEffect(() => {
    if (!eventRegistered) {
      ipcRenderer.on('_clipboard_event_', (_event, value) => {
        let start = -1;
        for(let i=0; i<value.length; i++) {
          const code = value.charCodeAt(i);
          if (code === 65535) {
            if (start === -1) {
              start = i;
            } else {
              const tag =  value.substring(start+1, i);
              dispatch(addTag(tag));
              start = -1;
            }
          }
        }
      });
      setEventRegistered(true);
    }
  }, [eventRegistered]);

  if (market.length === 0) {
    return <Tips></Tips>
  }

  const nameTitle = (item:any) => {
    const itemData = data.find((i:any) => i.tag === item.tag);
    const itemName = _.get(itemData, 'data.localizedNames.EN-US', item.tag);
    const itemTier = _.get(itemData, 'data.tier');
    const itemEnchantmentLevel = _.get(itemData, 'data.enchantmentLevel', 0);
    const tierText = !itemTier ? '' : `T${ itemTier }${ itemEnchantmentLevel > 0 ? `.${ itemEnchantmentLevel }` : '' }`;
    return <div className="item-name">
      <span style={{ float: 'right', cursor: 'pointer', zIndex: 10 }} onClick={
        () => dispatch(removeTag(item.tag))
      }>x</span>
      <span style={{ position: 'absolute' }}>
        <img className="item-icon" src={ `https://gameinfo.albiononline.com/api/gameinfo/items/${ item.tag }` }></img>
      </span>
      <span className="item-name-title">{tierText} {itemName}</span>
    </div>
  }

  return (
    <div className="container" data-tid="container">
      {market.map((item:any) => {
        if (item.isLoading) {
          return <div key={ item.id } className="item-box">
            { nameTitle(item) }
            <div className="item-desc">Loading...</div>
          </div>
        }
        if (item.error) {
          return <div key={ item.id } className="item-box">
            { nameTitle(item) }
            <div className="item-desc">Error...</div>
          </div>
        }
        let priceList = item.data;
        priceList = _.sortBy(priceList, ['quality', 'city']);
        priceList = _.uniqBy(priceList, 'city');
        // filter cities not to show
        priceList = priceList.filter((city:any) => {
          const cityOption = cities.find(c => c.name === city.city);
          if (!cityOption) return false;
          if (options[cityOption.key] !== 'true') return false;
          return true;
        })
        const noZeroPriceList = priceList.filter((p:any) => p.sell_price_min > 0);
        let bestPriceCity:any = _.minBy(noZeroPriceList, 'sell_price_min');
        if (bestPriceCity) bestPriceCity = bestPriceCity.city;
        let worstPriceCity:any = _.maxBy(noZeroPriceList, 'sell_price_min');
        if (worstPriceCity) worstPriceCity = worstPriceCity.city;

        const highlight = options.highlightbestworstprice !== 'false';

        return <div key={ item.id } className="item-box">
          { nameTitle(item) }
          <div className="item-desc">{ Array.isArray(item.data) &&
            priceList.map((city:any) => {
              return <div
                key={city.city}
                className={ `item-city-box ${
                  highlight && worstPriceCity === city.city ? 'worst-highlight' : ''
                } ${
                  highlight && bestPriceCity === city.city ? 'best-highlight' : ''
                }` }
              >
                <span className="item-city">{city.city}</span>
                <span className="item-price">{ numberFormat.format(city.sell_price_min) }</span>
              </div>
            })
          }</div>
        </div>
      })}
      <Options />
    </div>
  );
}

const mapStateToProps = (state:any) => ({
  data: state.items.itemData,
  market: state.items.itemList,
  options: state.options,
})

export default connect(mapStateToProps)(Home);
