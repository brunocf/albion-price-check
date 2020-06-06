import React from 'react';
import { connect } from 'react-redux';

function Tips() {
  return <>
    <div style={{ fontWeight: 'bold', textAlign: 'center', width: '100%', marginTop: '20px' }}>
      Welcome to Albion Price Check
    </div>
    <div className="tip-line">
      To get an item price, follow this steps:
      <div>
        <div>&nbsp;&nbsp;1. Inside Albion, press 'Enter' to open the chat.</div>
        <div>&nbsp;&nbsp;2. Hold 'Ctrl' and click at the item icon inside your bag or chest, the item will apper at the chat input.</div>
        <div>&nbsp;&nbsp;3. Press 'Ctrl + A' to select everything at the chat input.</div>
        <div>&nbsp;&nbsp;4. Press 'Ctrl + C' to copy the chat input with the itens to the Clipboard.</div>
        <div>&nbsp;&nbsp;5. Press 'Ctrl + Shift + C' to send the Clipboard information to here.</div>
      </div>
    </div>
  </>
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Tips);
