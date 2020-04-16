"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactHighlightWords = _interopRequireDefault(require("react-highlight-words"));

require("./index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_API_URI = 'https://suggestions.dadata.ru';
var wordsToPass = ['г', 'респ', 'ул', 'р-н', 'село', 'деревня', 'поселок', 'пр-д', 'пл', 'к', 'кв', 'обл', 'д'];
var defaultSuggestion = {
  data: {},
  unrestricted_value: '',
  value: ''
};

var escapeForRegexp = function escapeForRegexp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

var getHighlightWords = function getHighlightWords(query) {
  var words = escapeForRegexp(query).replace(',', '').split(' ');
  var filteredWords = words.filter(function (word) {
    return wordsToPass.indexOf(word) < 0;
  });
  return filteredWords;
};

var SuggestionInfo = function SuggestionInfo(_ref) {
  var data = _ref.data,
      type = _ref.type;
  return React.createElement("div", {
    className: "react-dadata__suggestion-info"
  }, React.createElement("span", null, type === 'party' ? data.inn : data.bic, " ", data.address && data.address.value));
};

var SuggestionsList = function SuggestionsList(_ref2) {
  var suggestions = _ref2.suggestions,
      suggestionIndex = _ref2.suggestionIndex,
      query = _ref2.query,
      type = _ref2.type,
      onSuggestionClick = _ref2.onSuggestionClick;
  return React.createElement("div", {
    className: "react-dadata__suggestions"
  }, React.createElement("div", {
    className: "react-dadata__suggestion-note"
  }, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0438\u043B\u0438 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u0435 \u0432\u0432\u043E\u0434"), suggestions.map(function (_ref3, index) {
    var value = _ref3.value,
        data = _ref3.data;
    return React.createElement("div", {
      key: value + index,
      onMouseDown: function onMouseDown() {
        onSuggestionClick(index);
      },
      className: "react-dadata__suggestion ".concat(index === suggestionIndex && 'react-dadata__suggestion--current')
    }, React.createElement(_reactHighlightWords["default"], {
      highlightClassName: "react-dadata--highlighted",
      searchWords: getHighlightWords(query),
      textToHighlight: value
    }), (type === 'party' || type === 'bank') && React.createElement(SuggestionInfo, {
      data: data,
      type: type
    }));
  }));
};

var ReactDadata =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ReactDadata, _React$Component);

  function ReactDadata() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ReactDadata);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ReactDadata)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      query: _this.props.query || '',
      type: _this.props.type || 'address',
      inputFocused: false,
      showSuggestions: true,
      suggestions: [],
      suggestionIndex: 0,
      isValid: _this.props.query && !_this.props.fetchOnMount
    });

    _defineProperty(_assertThisInitialized(_this), "textInput", React.createRef());

    _defineProperty(_assertThisInitialized(_this), "xhr", new XMLHttpRequest());

    _defineProperty(_assertThisInitialized(_this), "componentDidMount", function () {
      if (_this.props.query && _this.props.fetchOnMount) {
        _this.fetchSuggestions();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "componentDidUpdate", function (prevProps) {
      if (_this.props.query !== prevProps.query && _this.props.query !== '') {
        _this.setState({
          query: _this.props.query,
          isValid: !!_this.props.query || undefined
        }, _this.fetchSuggestions);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onInputFocus", function () {
      _this.setState({
        inputFocused: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onInputBlur", function (event) {
      var isValid = _this.state.isValid;
      var value = event.target.value;

      if (isValid === false) {
        if (_this.props.allowCustomValue) _this.returnCustomValue(value);else if (_this.props.clearOnBlur) _this.clear();
      }

      _this.setState({
        inputFocused: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onInputChange", function (event) {
      var value = event.target.value;
      if (!value) return _this.clear();

      _this.setState({
        query: value,
        showSuggestions: true,
        isValid: false
      }, function () {
        _this.fetchSuggestions();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onKeyPress", function (event) {
      var _this$state = _this.state,
          suggestionIndex = _this$state.suggestionIndex,
          suggestions = _this$state.suggestions,
          query = _this$state.query;

      if (event.which === 40 && suggestionIndex < suggestions.length - 1) {
        // Arrow down
        _this.setState(function (prevState) {
          return {
            suggestionIndex: prevState.suggestionIndex + 1
          };
        });
      } else if (event.which === 38 && suggestionIndex > 0) {
        // Arrow up
        _this.setState(function (prevState) {
          return {
            suggestionIndex: prevState.suggestionIndex - 1
          };
        });
      } else if (event.which === 39 && suggestionIndex >= 0) {
        // Arrow right
        _this.selectSuggestion(_this.state.suggestionIndex, true);
      } else if (event.which === 13 && suggestionIndex >= 0) {
        // Enter
        _this.selectSuggestion(_this.state.suggestionIndex);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "fetchSuggestions", function () {
      _this.xhr.abort();

      var type = _this.state.type;
      var _this$props = _this.props,
          baseUrl = _this$props.baseUrl,
          city = _this$props.city,
          constraints = _this$props.constraints,
          filter = _this$props.filter;

      var payload = _objectSpread({
        query: _this.state.query,
        count: _this.props.count || 10
      }, constraints); // TODO: change this prop behavior later


      if (city && type === 'address') {
        payload.from_bound = {
          value: 'city'
        };
        payload.to_bound = {
          value: 'settlement'
        };
        payload.value = 'settlement';
      }

      _this.xhr.open('POST', "".concat(baseUrl, "/suggestions/api/4_1/rs/suggest/").concat(type));

      _this.xhr.setRequestHeader('Accept', 'application/json');

      _this.xhr.setRequestHeader('Authorization', "Token ".concat(_this.props.token));

      _this.xhr.setRequestHeader('Content-Type', 'application/json');

      _this.xhr.send(JSON.stringify(payload));

      _this.xhr.onreadystatechange = function () {
        if (_this.xhr.readyState !== 4) {
          return;
        }

        if (_this.xhr.status === 200) {
          var _JSON$parse = JSON.parse(_this.xhr.response),
              suggestions = _JSON$parse.suggestions;

          if (suggestions) {
            var filteredSuggestions = filter ? filter(suggestions) : suggestions;

            _this.setState({
              suggestions: filteredSuggestions,
              suggestionIndex: 0
            });
          }
        }
      };
    });

    _defineProperty(_assertThisInitialized(_this), "findById", function (id, callback, suggestion) {
      if (!id) {
        callback && callback(suggestion);
        return;
      }

      _this.xhr.abort();

      var type = _this.state.type;
      var _this$props2 = _this.props,
          constraints = _this$props2.constraints,
          baseUrl = _this$props2.baseUrl;

      var payload = _objectSpread({
        query: id
      }, constraints);

      _this.xhr.open('POST', "".concat(baseUrl, "/suggestions/api/4_1/rs/findById/").concat(type));

      _this.xhr.setRequestHeader('Accept', 'application/json');

      _this.xhr.setRequestHeader('Authorization', "Token ".concat(_this.props.token));

      _this.xhr.setRequestHeader('Content-Type', 'application/json');

      _this.xhr.send(JSON.stringify(payload));

      _this.xhr.onreadystatechange = function () {
        if (_this.xhr.readyState !== 4) {
          return;
        }

        if (_this.xhr.status === 200) {
          var _JSON$parse2 = JSON.parse(_this.xhr.response),
              suggestions = _JSON$parse2.suggestions;

          if (suggestions) {
            _this.setState({
              suggestions: suggestions,
              suggestionIndex: 0
            });

            callback && callback(suggestions[0]);
            return suggestions;
          }
        }
      };
    });

    _defineProperty(_assertThisInitialized(_this), "onSuggestionClick", function (index) {
      _this.selectSuggestion(index);
    });

    _defineProperty(_assertThisInitialized(_this), "returnCustomValue", function (value) {
      return _this.props.onChange && _this.props.onChange(_objectSpread({}, defaultSuggestion, {
        value: value
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "clear", function () {
      _this.setState({
        query: '',
        showSuggestions: false,
        isValid: false
      });

      _this.props.onChange && _this.props.onChange(defaultSuggestion);
    });

    _defineProperty(_assertThisInitialized(_this), "extract", function (suggestion) {
      var dataExtract = _this.props.dataExtract;
      if (!dataExtract || !suggestion) return suggestion;
      var data = suggestion.data;
      if (!data) return suggestion;else if (dataExtract instanceof Function) {
        return _objectSpread({}, suggestion, {
          value: dataExtract(data)
        });
      } else if (typeof dataExtract === 'string' && dataExtract) {
        return _objectSpread({}, suggestion, {
          value: data[dataExtract]
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "selectSuggestion", function (index) {
      var showSuggestions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var _this$state2 = _this.state,
          suggestions = _this$state2.suggestions,
          query = _this$state2.query;

      var suggestion = _this.extract(suggestions[index]);

      var _ref4 = suggestion || defaultSuggestion,
          value = _ref4.value;

      if (!value && _this.props.allowCustomValue) return _this.props.onChange(_objectSpread({}, defaultSuggestion, {
        value: query
      }));

      _this.setState({
        query: value,
        showSuggestions: showSuggestions,
        isValid: !!value
      });

      if (_this.props.mode === 'extended' && suggestion.data) {
        switch (_this.state.type) {
          case 'address':
            _this.findById(suggestion.data.fias_id || suggestion.data.kladr_id, _this.props.onChange, suggestion);

            break;

          case 'party':
            _this.findById(suggestion.data.inn, _this.props.onChange, suggestion);

            break;

          default:
        }
      } else {
        _this.props.onChange && _this.props.onChange(suggestion);
      }
    });

    return _this;
  }

  _createClass(ReactDadata, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state3 = this.state,
          suggestionIndex = _this$state3.suggestionIndex,
          query = _this$state3.query,
          inputFocused = _this$state3.inputFocused,
          suggestions = _this$state3.suggestions,
          showSuggestions = _this$state3.showSuggestions,
          type = _this$state3.type;
      var _this$props3 = this.props,
          placeholder = _this$props3.placeholder,
          autocomplete = _this$props3.autocomplete,
          styles = _this$props3.styles,
          allowClear = _this$props3.allowClear,
          className = _this$props3.className,
          name = _this$props3.name,
          label = _this$props3.label;
      var showSuggestionsList = inputFocused && showSuggestions && !!suggestions.length;
      return React.createElement("div", {
        className: "react-dadata react-dadata__container ".concat(className),
        style: styles
      }, React.createElement("input", {
        name: name,
        className: "react-dadata__input".concat(allowClear ? ' react-dadata__input-clearable' : ''),
        placeholder: placeholder || '',
        value: query || '',
        ref: function ref(input) {
          _this2.textInput = input;
        },
        onChange: this.onInputChange,
        onKeyDown: this.onKeyPress,
        onFocus: this.onInputFocus,
        onBlur: this.onInputBlur,
        autoComplete: autocomplete || 'off'
      }), allowClear && query && React.createElement("span", {
        className: "react-dadata__input-suffix",
        onClick: this.clear
      }, React.createElement("i", {
        className: "react-dadata__icon react-dadata__icon-clear"
      })), showSuggestionsList && React.createElement(SuggestionsList, {
        suggestions: suggestions,
        suggestionIndex: suggestionIndex,
        query: query,
        type: type,
        onSuggestionClick: this.onSuggestionClick
      }), label && React.createElement("label", {
        className: "react-dadata__label",
        htmlFor: name
      }, label));
    }
  }]);

  return ReactDadata;
}(React.Component);

ReactDadata.propTypes = {
  autocomplete: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].string]),
  city: _propTypes["default"].bool,
  className: _propTypes["default"].string,
  count: _propTypes["default"].number,
  onChange: _propTypes["default"].func,
  placeholder: _propTypes["default"].string,
  query: _propTypes["default"].string,
  style: _propTypes["default"].objectOf(_propTypes["default"].string),
  token: _propTypes["default"].string.isRequired,
  type: _propTypes["default"].string,
  allowClear: _propTypes["default"].bool,
  constraints: _propTypes["default"].object,
  dataExtract: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),
  name: _propTypes["default"].string,
  label: _propTypes["default"].string,
  clearOnBlur: _propTypes["default"].bool,
  allowCustomValue: _propTypes["default"].bool,
  fetchOnMount: _propTypes["default"].bool,
  filter: _propTypes["default"].func,
  mode: _propTypes["default"].string,
  baseUrl: _propTypes["default"].string
};
ReactDadata.defaultProps = {
  clearOnBlur: false,
  allowCustomValue: false,
  fetchOnMount: false,
  mode: 'standard',
  baseUrl: DEFAULT_API_URI
};
var _default = ReactDadata;
exports["default"] = _default;