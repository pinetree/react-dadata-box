import React, { Component } from 'react';
import ReactDadataBox from '../src';

import './index.css';

const token = 'ff2eea11bd30f0e52d7107978323e3dcc170d5f1';

class App extends Component {
  state = {
    value: ''
  };

  handleChange = e => {
    this.setState({ value: e ? (e.hasOwnProperty('target') ? e.target.value : e.value) : '' });
  };

  render() {
    return (
      <div>
        <input placeholder="адрес" value={this.state.value} onChange={this.handleChange} />
        <ReactDadataBox
          className="data"
          token={token}
          placeholder="Адрес"
          type="address"
          query={this.state.value}
          onChange={this.handleChange}
          allowClear
        />
        <ReactDadataBox className="data" token={token} placeholder="Адрес" type="address" query={this.state.value} />
        <ReactDadataBox className="data" token={token} placeholder="Организация" type="party" />
        <ReactDadataBox className="data" token={token} placeholder="Банк" type="bank" />
        <ReactDadataBox className="data" token={token} placeholder="Email" type="email" />
        <ReactDadataBox className="data" token={token} placeholder="ФИО" type="fio" />
        <ReactDadataBox className="data" token={token} placeholder="Город" type="address" city={true} />
      </div>
    );
  }
}

export default App;
