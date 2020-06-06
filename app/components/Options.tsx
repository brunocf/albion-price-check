import React, { useState } from 'react';
import './Home.css';
import { connect } from 'react-redux';
import _ from 'lodash';
import { setOption, cities } from '../redux/actions/options';


function Options(props:any) {
  const {
    dispatch,
    options
  } = props;

  const [opened, setOpened] = useState(false);

  return (<>
    <div
      style={{
        textAlign: 'center',
        width: '100%',
        cursor: 'pointer',
        paddingTop: '5px',
        fontSize: 'small'
      }}
      onClick={ () => setOpened(!opened) }

    >
      Options
    </div>
    { opened &&
      <div className="option-box">
        <hr />
        <div className="option-title">Show Cities</div>
        <div className="option-city">
          { cities.map((city:any) => {
            return <div key={ city }>
              <input
                type="checkbox"
                id={ city.key }
                checked={ options[city.key] !== 'false' }
                onChange={ (e) => dispatch(setOption(city.key, `${ e.target.checked }`)) }
              />
              <label htmlFor={ city.key }>{ city.name }</label>
            </div>
          })}
        </div>
        <hr />
        <div className="option-title">Highlight</div>
        <div className="option-city">
          <div>
            <input
              type="checkbox"
              id="highlightbestworstprice"
              checked={ options.highlightbestworstprice !== 'false' }
              onChange={ (e) => dispatch(setOption('highlightbestworstprice', `${ e.target.checked }`)) }
            />
            <label htmlFor="highlightbestworstprice">Best and worst price</label>
          </div>
        </div>
      </div>
    }
  </>);
}

const mapStateToProps = (state:any) => ({
  options: state.options,
})

export default connect(mapStateToProps)(Options);
