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
    this.setState({
      query: data ? data.value : this.state.query,
      result: data
    });
  };

  render() {
    const { data } = this.state.result || {};

    return (
      <>
        <div id="left">
          <h3>Пример ввода в другой input:</h3>
          <input placeholder="адрес" value={this.state.query} onChange={this.handleType} />
          <pre>
            <strong>Response:</strong>
            <br />
            <code>
              {data &&
                JSON.stringify(data)
                  .split(',')
                  .join('\n')}
            </code>
          </pre>
        </div>

        <ol id="right">
          <li>
            <h1>Все населённые пункты мира</h1>
            <ReactDadataBox
              name="country"
              label="Город"
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
              clearOnBlur
              fetchOnMount
            />
          </li>

          <li>
            <h1>Все страны мира</h1>
            <ReactDadataBox
              className="data"
              token={token}
              placeholder="Страна"
              type="country"
              onChange={this.handleChange}
              allowClear
            />
          </li>

          <li>
            <h1>Все области внутри выбранной страны</h1>
            <ReactDadataBox
              className="data"
              token={token}
              placeholder="Области внутри России"
              type="address"
              constraints={{
                locations: [{ country: 'Россия' }],
                from_bound: { value: 'region' },
                to_bound: { value: 'region' }
              }}
              onChange={this.handleChange}
              dataExtract={'region_with_type'}
              allowClear
            />
          </li>

          <li>
            <h1>Все районы внутри выбранной области/региона</h1>
            <ReactDadataBox
              className="data"
              token={token}
              placeholder="Районы Московской области"
              type="address"
              constraints={{
                locations: [{ country: 'Россия', region: 'Московская' }],
                from_bound: { value: 'area' },
                to_bound: { value: 'area' }
              }}
              onChange={this.handleChange}
              dataExtract={'area_with_type'}
              allowClear
            />
          </li>

          <li>
            <h1>Все населенные пункты внутри выбранного района</h1>
            <ReactDadataBox
              className="data"
              token={token}
              placeholder="Нас.пункты внутри Пушкинского р-на Московсковской обл"
              type="address"
              constraints={{
                locations: [{ country: 'Россия', region: 'Московская', area: 'Пушкинский' }],
                from_bound: { value: 'city' },
                to_bound: { value: 'settlement' }
              }}
              onChange={this.handleChange}
              dataExtract={({ city, settlement_with_type }) => city || settlement_with_type}
              allowClear
            />
          </li>

          <li>
            <h1>Адрес, до номера дома</h1>
            <ReactDadataBox
              className="data"
              token={token}
              placeholder="Адрес, до номера дома"
              type="address"
              onChange={this.handleChange}
              allowClear
            />
          </li>

          <li>
            <h1>Все населённые пункты мира по индексу</h1>
            <ReactDadataBox
              name="index"
              className="data"
              token={token}
              placeholder="Индекс"
              type="address"
              onChange={this.handleChange}
              constraints={{
                locations: [{ country: '*' }]
              }}
              allowClear
            />
          </li>

          <li>
            <h1>Допускается свой ввод (в ответе в value придет то, что набрано в input)</h1>
            <ReactDadataBox
              name="index"
              className="data"
              token={token}
              placeholder="Произвольный индекс, который может быть не найден в Dadata базе"
              type="address"
              onChange={this.handleChange}
              allowClear
              allowInput
            />
          </li>

          <li>
            <h1>Прочее</h1>
            <ReactDadataBox className="data" token={token} placeholder="Организация" type="party" />
            <ReactDadataBox className="data" token={token} placeholder="Банк" type="bank" />
            <ReactDadataBox className="data" token={token} placeholder="Email" type="email" />
            <ReactDadataBox className="data" token={token} placeholder="ФИО" type="fio" />
            <ReactDadataBox className="data" token={token} placeholder="Город" type="address" city={true} />
          </li>
        </ol>
      </>
    );
  }
}

export default App;
