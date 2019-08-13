import React, { Component } from 'react';
import ReactDadataBox from '../src';

import './index.css';

const token = 'ff2eea11bd30f0e52d7107978323e3dcc170d5f1';

class App extends Component {
  state = {
    query: '',
    result: {}
  };

  handleType = e => this.setState({ query: e.target.value });

  handleChange = data => {
    console.log(data);
    this.setState({
      query: data ? data.value : this.state.query,
      result: data
    });
  };

  render() {
    const { data } = this.state.result;

    console.log('aa', data);
    return (
      <div>
        <div>
          <h3>Пример ввода в другой input:</h3>
          <input placeholder="адрес" value={this.state.query} onChange={this.handleType} />
          <div>
            Response:
            {data && JSON.stringify(data)}
          </div>
        </div>

        <ol>
          <li>
            <h1>Все населённые пункты мира</h1>
            <ReactDadataBox
              className="data"
              token={token}
              placeholder="Город или населенный пункт в любой стране мира"
              type="address"
              query={this.state.query}
              onChange={this.handleChange}
              constraints={{
                locations: [{ country: '*' }],
                from_bound: { value: 'city' },
                restrict_value: false,
                to_bound: { value: 'settlement' }
              }}
              allowClear
            />
          </li>
        </ol>

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
