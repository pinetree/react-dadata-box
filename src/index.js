import * as React from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';
import './index.css';

const DEFAULT_API_URI = 'https://suggestions.dadata.ru';

const wordsToPass = ['г', 'респ', 'ул', 'р-н', 'село', 'деревня', 'поселок', 'пр-д', 'пл', 'к', 'кв', 'обл', 'д'];

const defaultSuggestion = {
  data: {},
  unrestricted_value: '',
  value: ''
};

const escapeForRegexp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getHighlightWords = query => {
  const words = escapeForRegexp(query)
    .replace(',', '')
    .split(' ');
  const filteredWords = words.filter(word => wordsToPass.indexOf(word) < 0);
  return filteredWords;
};

const SuggestionInfo = ({ data, type }) => (
  <div className="react-dadata__suggestion-info">
    <span>
      {type === 'party' ? data.inn : data.bic} {data.address && data.address.value}
    </span>
  </div>
);

const SuggestionsList = ({ suggestions, suggestionIndex, query, type, onSuggestionClick }) => (
  <div className="react-dadata__suggestions">
    <div className="react-dadata__suggestion-note">Выберите вариант или продолжите ввод</div>
    {suggestions.map(({ value, data }, index) => (
      <div
        key={value + index}
        onMouseDown={() => {
          onSuggestionClick(index);
        }}
        className={`react-dadata__suggestion ${index === suggestionIndex && 'react-dadata__suggestion--current'}`}
        data-suggestion-status={(data && data.state && data.state.status) || ''}
      >
        <Highlighter
          highlightClassName="react-dadata--highlighted"
          searchWords={getHighlightWords(query)}
          textToHighlight={value}
          className="react-dadata__suggestion--value"
        />
        {(type === 'party' || type === 'bank') && <SuggestionInfo data={data} type={type} />}
      </div>
    ))}
  </div>
);

class ReactDadata extends React.Component {
  state = {
    query: this.props.query || '',
    type: this.props.type || 'address',
    inputFocused: false,
    showSuggestions: true,
    suggestions: [],
    suggestionIndex: 0,
    isValid: this.props.query && !this.props.fetchOnMount
  };

  textInput = React.createRef();
  xhr = new XMLHttpRequest();

  componentDidMount = () => {
    if (this.props.query && this.props.fetchOnMount) {
      this.fetchSuggestions();
    }
  };

  componentDidUpdate = prevProps => {
    if (this.props.query !== prevProps.query && this.props.query !== '') {
      this.setState(
        {
          query: this.props.queryModifier ? this.props.queryModifier(this.props.query) : this.props.query,
          rawQuery: this.props.query,
          isValid: !!this.props.query || undefined
        },
        this.fetchSuggestions
      );
    }
  };

  onInputFocus = event => {
    this.setState({ inputFocused: true });

    this.textInput.current.selectionStart = this.textInput.current.value.length;
    this.textInput.current.selectionEnd = this.textInput.current.value.length;

    this.props.onFocus && this.props.onFocus(event);
  };

  onInputBlur = event => {
    const { isValid } = this.state;
    const { value } = event.target;

    if (isValid === false) {
      if (this.props.allowCustomValue) this.returnCustomValue(value);
      else if (this.props.clearOnBlur) this.clear();
    }

    this.setState({ inputFocused: false });
    this.props.onBlur && this.props.onBlur(event);
  };

  onInputChange = event => {
    this.props.onInputChange && this.props.onInputChange(event);

    const { value } = event.target;

    if (!value) return this.clear();

    const query = this.props.queryModifier ? this.props.queryModifier(value) : value;

    this.setState({ query, rawQuery: value, showSuggestions: true, isValid: false }, () => {
      this.fetchSuggestions();
    });
  };

  onKeyPress = event => {
    const { suggestionIndex, suggestions, query } = this.state;

    if (event.which === 40 && suggestionIndex < suggestions.length - 1) {
      // Arrow down
      this.setState(prevState => ({ suggestionIndex: prevState.suggestionIndex + 1 }));
    } else if (event.which === 38 && suggestionIndex > 0) {
      // Arrow up
      this.setState(prevState => ({ suggestionIndex: prevState.suggestionIndex - 1 }));
    } else if (event.which === 39 && suggestionIndex >= 0) {
      // Arrow right
      this.selectSuggestion(this.state.suggestionIndex, true);
    } else if (event.which === 13 && suggestionIndex >= 0) {
      // Enter
      this.selectSuggestion(this.state.suggestionIndex);
    }
  };

  fetchSuggestions = () => {
    this.xhr.abort();

    const { type } = this.state;
    const { baseUrl, city, constraints, filter, disableSuggest } = this.props;

    if (disableSuggest) return;

    const payload = {
      query: this.state.query,
      count: this.props.count || 10,
      ...constraints
    };

    // TODO: change this prop behavior later
    if (city && type === 'address') {
      payload.from_bound = { value: 'city' };
      payload.to_bound = { value: 'settlement' };
      payload.value = 'settlement';
    }

    this.xhr.open('POST', `${baseUrl}/suggestions/api/4_1/rs/suggest/${type}`);
    this.xhr.setRequestHeader('Accept', 'application/json');
    this.xhr.setRequestHeader('Authorization', `Token ${this.props.token}`);
    this.xhr.setRequestHeader('Content-Type', 'application/json');
    this.xhr.send(JSON.stringify(payload));

    this.xhr.onreadystatechange = () => {
      if (this.xhr.readyState !== 4) {
        return;
      }

      if (this.xhr.status === 200) {
        const { suggestions } = JSON.parse(this.xhr.response);

        if (suggestions) {
          const filteredSuggestions = filter ? filter(suggestions) : suggestions;
          const suggestionsState = { suggestions: filteredSuggestions, suggestionIndex: 0 };
          this.setState(suggestionsState);
          this.props.onSuggest && this.props.onSuggest(suggestionsState);
        }
      }
    };
  };

  findById = (id, callback, suggestion) => {
    if (!id) {
      callback && callback(suggestion);
      return;
    }

    this.xhr.abort();

    const { type } = this.state;
    const { constraints, baseUrl } = this.props;

    const payload = {
      query: id,
      ...constraints
    };

    this.xhr.open('POST', `${baseUrl}/suggestions/api/4_1/rs/findById/${type}`);
    this.xhr.setRequestHeader('Accept', 'application/json');
    this.xhr.setRequestHeader('Authorization', `Token ${this.props.token}`);
    this.xhr.setRequestHeader('Content-Type', 'application/json');
    this.xhr.send(JSON.stringify(payload));

    this.xhr.onreadystatechange = () => {
      if (this.xhr.readyState !== 4) {
        return;
      }

      if (this.xhr.status === 200) {
        const { suggestions } = JSON.parse(this.xhr.response);

        if (suggestions) {
          this.setState({ suggestions: suggestions, suggestionIndex: 0 });
          callback && callback(suggestions[0]);
          return suggestions;
        }
      }
    };
  };

  onSuggestionClick = index => {
    this.textInput.current && this.textInput.current.focus();
    this.selectSuggestion(index);
  };

  returnCustomValue = value => this.props.onChange && this.props.onChange({ ...defaultSuggestion, value });

  clear = () => {
    this.setState({
      query: '',
      showSuggestions: false,
      isValid: false
    });
    this.props.onChange && this.props.onChange(defaultSuggestion);
  };

  extract = suggestion => {
    const { dataExtract } = this.props;

    if (!dataExtract || !suggestion) return suggestion;

    const { data } = suggestion;

    if (!data) return suggestion;
    else if (dataExtract instanceof Function) {
      return {
        ...suggestion,
        value: dataExtract(data)
      };
    } else if (typeof dataExtract === 'string' && dataExtract) {
      return {
        ...suggestion,
        value: data[dataExtract]
      };
    }
  };

  selectSuggestion = (index, showSuggestions = false) => {
    const { suggestions, query } = this.state;
    const suggestion = this.extract(suggestions[index]);
    const { value } = suggestion || defaultSuggestion;

    if (!value && this.props.allowCustomValue) return this.props.onChange({ ...defaultSuggestion, value: query });

    this.setState({
      query: value,
      showSuggestions: showSuggestions,
      isValid: !!value
    });

    if (this.props.mode === 'extended' && suggestion.data) {
      switch (this.state.type) {
        case 'address':
          this.findById(suggestion.data.fias_id || suggestion.data.kladr_id, this.props.onChange, suggestion);
          break;
        case 'party':
          this.findById(suggestion.data.ogrn || suggestion.data.inn, this.props.onChange, suggestion);
          break;
        default:
      }
    } else {
      this.props.onChange && this.props.onChange(suggestion);
    }
  };

  render() {
    const { suggestionIndex, query, inputFocused, suggestions, showSuggestions, type } = this.state;
    const { placeholder, autocomplete, styles, allowClear, className, name, label, disableSuggest, customInput } = this.props;

    const showSuggestionsList = inputFocused && !disableSuggest && showSuggestions && !!suggestions.length;
    const Component = customInput || 'input'

    return (
      <div className={`react-dadata react-dadata__container ${className}`} style={styles}>
        <Component
          name={name}
          className={`react-dadata__input${allowClear ? ' react-dadata__input-clearable' : ''}`}
          placeholder={placeholder || ''}
          value={query || ''}
          ref={input => {
            this.textInput = input;
          }}
          onChange={this.onInputChange}
          onKeyDown={this.onKeyPress}
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
          autoComplete={autocomplete || 'off'}
        />
        {allowClear && query && (
          <span className="react-dadata__input-suffix" onClick={this.clear}>
            <i className="react-dadata__icon react-dadata__icon-clear" />
          </span>
        )}
        {showSuggestionsList && (
          <SuggestionsList
            suggestions={suggestions}
            suggestionIndex={suggestionIndex}
            query={query}
            type={type}
            onSuggestionClick={this.onSuggestionClick}
          />
        )}
        {label && (
          <label className="react-dadata__label" htmlFor={name}>
            {label}
          </label>
        )}
      </div>
    );
  }
}

ReactDadata.propTypes = {
  autocomplete: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  city: PropTypes.bool,
  className: PropTypes.string,
  count: PropTypes.number,
  onChange: PropTypes.func,
  onSuggest: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onInputChange: PropTypes.func,
  placeholder: PropTypes.string,
  query: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.string),
  token: PropTypes.string.isRequired,
  type: PropTypes.string,
  allowClear: PropTypes.bool,
  constraints: PropTypes.object,
  dataExtract: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  name: PropTypes.string,
  label: PropTypes.string,
  clearOnBlur: PropTypes.bool,
  allowCustomValue: PropTypes.bool,
  fetchOnMount: PropTypes.bool,
  filter: PropTypes.func,
  mode: PropTypes.string,
  baseUrl: PropTypes.string,
  disableSuggest: PropTypes.bool,
  queryModifier: PropTypes.func,
  customInput: PropTypes.func
};

ReactDadata.defaultProps = {
  clearOnBlur: false,
  allowCustomValue: false,
  fetchOnMount: false,
  mode: 'standard',
  baseUrl: DEFAULT_API_URI,
  disableSuggest: false
};

export default ReactDadata;
