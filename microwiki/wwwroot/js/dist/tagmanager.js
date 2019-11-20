var MicroWiki =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./wwwroot/js/tagmanager.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/mab-bootstrap-taginput/css/standard.css":
/*!****************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/mab-bootstrap-taginput/css/standard.css ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ".mab-bootstrap-taginput {\r\n    display: flex;\r\n    cursor: text;\r\n}\r\n\r\n.mab-bootstrap-taginput.form-control {\r\n    line-height: normal;\r\n}\r\n\r\n.mab-bootstrap-taginput-tag {\r\n    color: #fff;\r\n    background-color: #007bff;\r\n    display: inline-flex;\r\n    align-items: center;\r\n    padding: .25em .4em;\r\n    font-size: 90%;\r\n    font-weight: 700;\r\n    white-space: nowrap;\r\n    border-radius: .25rem;\r\n    margin-right: 5px;\r\n    transition: background-color 1600ms ease-in;\r\n}\r\n\r\n.mab-bootstrap-taginput-tag .fa {\r\n    margin-left: 5px;\r\n    font-size: 80%;\r\n    cursor: pointer;\r\n}\r\n\r\n.mab-bootstrap-taginput-tag-warning {\r\n    background-color:#cc0000;\r\n    transition: none;\r\n}\r\n\r\n.mab-bootstrap-taginput-input {\r\n    border: solid 1px transparent;\r\n    outline: none;\r\n    width: 100px;\r\n}\r\n\r\n.mab-bootstrap-taginput-input.mab-bootstrap-taginput-input-narrowed {\r\n    width: 1px;\r\n}\r\n\r\n.mab-bootstrap-taginput-input-container {\r\n    position: relative;\r\n}\r\n\r\n.mab-bootstrap-taginput-suggestions {\r\n    position: absolute;\r\n    top: 30px;\r\n    left: 0;\r\n    min-width: 200px;\r\n    min-height: 30px;\r\n    background-color: #fff;\r\n    border: solid 1px #e0e0e0;\r\n    border-radius: 3px;\r\n    padding: 3px 0;\r\n    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);\r\n    z-index: 10000;\r\n}\r\n\r\n.mab-bootstrap-taginput-suggestions-hidden {\r\n    display: none;\r\n}\r\n\r\n.mab-bootstrap-taginput-suggestion {\r\n    padding: 5px 10px;\r\n    cursor: pointer;\r\n}\r\n\r\n.mab-bootstrap-taginput-suggestion-selected,\r\n.mab-bootstrap-taginput-suggestion:hover {\r\n    background-color: #007bff;\r\n    color: #fff;\r\n}\r\n", ""]);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], "{").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      // eslint-disable-next-line prefer-destructuring
      var id = this[i][0];

      if (id != null) {
        alreadyImportedModules[id] = true;
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = modules[_i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      // when a module is imported multiple times with different media queries.
      // I hope this will never occur (Hey this way we have smaller bundles)

      if (item[0] == null || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = "(".concat(item[2], ") and (").concat(mediaQuery, ")");
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot).concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "./node_modules/mab-bootstrap-taginput/css/standard.css":
/*!**************************************************************!*\
  !*** ./node_modules/mab-bootstrap-taginput/css/standard.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../../css-loader/dist/cjs.js!./standard.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/mab-bootstrap-taginput/css/standard.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ "./node_modules/mab-bootstrap-taginput/dist/TagInput.js":
/*!**************************************************************!*\
  !*** ./node_modules/mab-bootstrap-taginput/dist/TagInput.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Mustache = __webpack_require__(/*! mustache */ "mustache");
// tslint:disable-next-line: no-empty
function noop() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
}
// So range(10, 10, 5) = [10, 20, 30, 40, 50]
function range(start, step, count) {
    return Array.from({ length: count }, function (_, k) { return (k * step) + start; });
}
function matches(el, selector) {
    return (el.matches || el.webkitMatchesSelector).call(el, selector);
}
var KeyCodes;
(function (KeyCodes) {
    KeyCodes[KeyCodes["ENTER"] = 13] = "ENTER";
    KeyCodes[KeyCodes["TAB"] = 9] = "TAB";
    KeyCodes[KeyCodes["BACKSPACE"] = 8] = "BACKSPACE";
    KeyCodes[KeyCodes["HYPHEN"] = 45] = "HYPHEN";
    KeyCodes[KeyCodes["HOME"] = 35] = "HOME";
    KeyCodes[KeyCodes["END"] = 36] = "END";
    KeyCodes[KeyCodes["LEFT_ARROW"] = 37] = "LEFT_ARROW";
    KeyCodes[KeyCodes["UP_ARROW"] = 38] = "UP_ARROW";
    KeyCodes[KeyCodes["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
    KeyCodes[KeyCodes["DOWN_ARROW"] = 40] = "DOWN_ARROW";
})(KeyCodes || (KeyCodes = {}));
var KeyNavDirection;
(function (KeyNavDirection) {
    KeyNavDirection[KeyNavDirection["UP"] = 0] = "UP";
    KeyNavDirection[KeyNavDirection["DOWN"] = 1] = "DOWN";
})(KeyNavDirection || (KeyNavDirection = {}));
var EmptyString = '';
var controlKeyCodes = [
    KeyCodes.ENTER,
    KeyCodes.TAB,
    KeyCodes.BACKSPACE,
    KeyCodes.HYPHEN,
    KeyCodes.HOME,
    KeyCodes.END,
    KeyCodes.LEFT_ARROW,
    KeyCodes.UP_ARROW,
    KeyCodes.RIGHT_ARROW,
    KeyCodes.DOWN_ARROW
];
// Concatenate the key code ranges for numbers and letters
// Note that these are *key* codes, so the letter codes are the same for upper and lower case
var alphaNumericKeyCodes = range(48, 1, 10).concat(range(65, 1, 26));
var standardValidTagCharacterKeyCodes = alphaNumericKeyCodes.concat(controlKeyCodes);
var standardHtmlTemplate = "<div class=\"{{globalCssClassPrefix}}{{#containerClasses}} {{containerClasses}}{{/containerClasses}}\">\n    {{#tags}}{{> item}}{{/tags}}\n    <input class=\"{{globalCssClassPrefix}}-data\" type=\"hidden\" name=\"{{hiddenInput.name}}\" id=\"{{hiddenInput.id}}\" value=\"{{hiddenInput.value}}\">\n    <div class=\"{{globalCssClassPrefix}}-input-container\">\n        <input class=\"{{globalCssClassPrefix}}-input\" type=\"text\"{{#placeholder}} placeholder=\"{{placeholder}}\"{{/placeholder}}>\n        <div class=\"{{globalCssClassPrefix}}-suggestions {{globalCssClassPrefix}}-suggestions-hidden\"></div>\n    </div>\n</div>";
var standardItemTemplate = '<div class="{{globalCssClassPrefix}}-tag" data-id="{{id}}" data-label="{{label}}">{{label}} <i class="fa fa-times"></i></div>';
var standardSuggestionTemplate = '<div class="{{globalCssClassPrefix}}-suggestion" data-id="{{id}}" data-label="{{label}}">{{label}}</div>';
var TagInput = /** @class */ (function () {
    function TagInput(options) {
        var _this = this;
        this.getId = options.getId;
        this.getLabel = options.getLabel;
        this.newItemFactory = options.newItemFactory;
        this.data = options.data.map(function (item) { return ({ id: _this.getId(item), label: _this.getLabel(item) }); });
        var originalInput = options.input;
        this.enableSuggestions = options.enableSuggestions === false ? false : true;
        this.minCharsBeforeShowingSuggestions = options.minCharsBeforeShowingSuggestions || 2;
        this.allowNewTags = options.allowNewTags === false ? false : true;
        if (this.allowNewTags && !this.newItemFactory) {
            throw Error('A newItemFactory function must be specified if allowNewTags is true');
        }
        this.tagDataSeparator = options.tagDataSeparator || '|';
        this.validTagCharacterKeyCodes = options.validTagCharacterKeyCodes || standardValidTagCharacterKeyCodes;
        this.onTagAdded = options.onTagAdded || noop;
        this.onTagRemoved = options.onTagRemoved || noop;
        this.onTagsChanged = options.onTagsChanged || noop;
        this.globalCssClassPrefix = options.globalCssClassPrefix || 'mab-bootstrap-taginput';
        this.placeholderText = originalInput.getAttribute('placeholder');
        this.htmlTemplate = (options.htmlTemplate || standardHtmlTemplate).trim();
        this.itemTemplate = (options.itemTemplate || standardItemTemplate).trim();
        this.suggestionTemplate = (options.suggestionTemplate || standardSuggestionTemplate).trim();
        Mustache.parse(this.htmlTemplate);
        Mustache.parse(this.itemTemplate);
        Mustache.parse(this.suggestionTemplate);
        this.warningClass = this.globalCssClassPrefix + "-tag-warning";
        this.narrowedInputClass = this.globalCssClassPrefix + "-input-narrowed";
        this.suggestionDropdownClass = this.globalCssClassPrefix + "-suggestions";
        this.suggestionDropdownHiddenClass = this.globalCssClassPrefix + "-suggestions-hidden";
        this.suggestionClass = this.globalCssClassPrefix + "-suggestion";
        this.selectedSuggestionClass = this.suggestionClass + "-selected";
        var selectedIds = originalInput.value.split(this.tagDataSeparator);
        this.currentSelection = this.data.filter(function (item) { return selectedIds.includes(item.id); });
        var templateData = {
            containerClasses: originalInput.classList.value,
            globalCssClassPrefix: this.globalCssClassPrefix,
            tags: this.currentSelection,
            hiddenInput: {
                name: originalInput.name,
                id: originalInput.id,
                value: originalInput.value,
            },
            placeholder: this.placeholderText
        };
        var partials = {
            item: this.itemTemplate
        };
        var html = Mustache.render(this.htmlTemplate, templateData, partials);
        var template = document.createElement('template');
        template.insertAdjacentHTML('afterbegin', html);
        this.tagInputContainer = template.firstChild.cloneNode(true);
        this.tagInputHiddenInput = this.tagInputContainer.querySelector('[type=hidden]');
        this.tagInputTextInput = this.tagInputContainer.querySelector('[type=text]');
        this.tagInputSuggestionDropdown = this.tagInputContainer.querySelector("." + this.suggestionDropdownClass);
        template.remove();
        originalInput.insertAdjacentElement('afterend', this.tagInputContainer);
        originalInput.remove();
        this.tagInputContainer.addEventListener('click', function (e) {
            var element = e.target;
            if (element.classList.contains('fa-times')) {
                e.stopPropagation();
                _this.removeTag(element.parentElement);
            }
        }, false);
        if (this.enableSuggestions) {
            this.tagInputSuggestionDropdown.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
                var element, label;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            element = e.target;
                            label = element.getAttribute('data-label');
                            return [4 /*yield*/, this.addTag(label)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            this.tagInputTextInput.addEventListener('keyup', function (e) {
                // If the up or down arrows are hit, select the previous/next item in the suggestion list
                if (e.keyCode === KeyCodes.UP_ARROW || e.keyCode === KeyCodes.DOWN_ARROW) {
                    var direction = e.keyCode === KeyCodes.DOWN_ARROW ? KeyNavDirection.DOWN : KeyNavDirection.UP;
                    var selectedItem = _this.tagInputSuggestionDropdown.querySelector("." + _this.selectedSuggestionClass);
                    if (selectedItem) {
                        // TODO: Filter these based on class
                        // https://plainjs.com/javascript/traversing/get-siblings-of-an-element-40/
                        // An item is already selected, so select the previous/next sibling
                        var sibling = direction === KeyNavDirection.DOWN
                            ? selectedItem.nextElementSibling
                            : selectedItem.previousElementSibling;
                        // If sibling is null, we've reached the end (or beginning) of the list,
                        // so skip back around to the first (or last) item
                        if (!sibling) {
                            var allSiblings = _this.tagInputSuggestionDropdown.querySelectorAll("." + _this.suggestionClass);
                            if (direction === KeyNavDirection.DOWN) {
                                sibling = allSiblings[0];
                            }
                            else {
                                sibling = allSiblings[allSiblings.length - 1];
                            }
                        }
                        selectedItem.classList.remove(_this.selectedSuggestionClass);
                        sibling.classList.add(_this.selectedSuggestionClass);
                        _this.tagInputTextInput.value = sibling.getAttribute('data-label');
                    }
                    else if (direction === KeyNavDirection.DOWN) {
                        var firstElement = _this.tagInputSuggestionDropdown.firstChild;
                        firstElement.classList.add(_this.selectedSuggestionClass);
                        _this.tagInputTextInput.value = firstElement.getAttribute('data-label');
                    }
                }
                else if (_this.validTagCharacterKeyCodes.includes(e.keyCode)) {
                    var inputValue_1 = _this.getTextInputValue();
                    if (inputValue_1.length >= _this.minCharsBeforeShowingSuggestions) {
                        var suggestions = _this.data
                            .filter(function (t) { return !_this.currentSelection.includes(t); })
                            .filter(function (t) { return t.label.indexOf(inputValue_1) > -1; })
                            .map(function (t) {
                            var suggestionData = {
                                globalCssClassPrefix: _this.globalCssClassPrefix,
                                id: t.id,
                                label: t.label
                            };
                            return Mustache.render(_this.suggestionTemplate, suggestionData);
                        });
                        // TODO: show message (hit enter to add new tag) if no suggestions and new tags allowed?
                        if (suggestions.length) {
                            _this.tagInputSuggestionDropdown.innerHTML = suggestions.join('');
                            _this.showSuggestions();
                        }
                    }
                    else {
                        _this.hideSuggestions();
                    }
                }
            });
        }
        this.tagInputTextInput.addEventListener('keydown', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var inputValue, tagElements, lastTagElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.validTagCharacterKeyCodes.includes(e.keyCode)) {
                            e.preventDefault();
                        }
                        inputValue = this.getTextInputValue();
                        if (!(e.keyCode === KeyCodes.ENTER && inputValue !== EmptyString)) return [3 /*break*/, 2];
                        // Stop the form being submitted and prevent event bubbling
                        e.preventDefault();
                        e.stopPropagation();
                        return [4 /*yield*/, this.addTag(inputValue)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        // If backspace is hit and there's nothing in the input (if the input *isn't* empty,
                        // we don't want to prevent the default action, which is deleting a character)
                        if (e.keyCode === KeyCodes.BACKSPACE && inputValue === EmptyString) {
                            tagElements = this.tagInputContainer.querySelectorAll("." + this.globalCssClassPrefix + "-tag");
                            if (tagElements.length) {
                                lastTagElement = tagElements[tagElements.length - 1];
                                this.removeTag(lastTagElement);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        function isTextInput(target) {
            var element = target;
            return matches(element, 'input[type=text]');
        }
        this.tagInputTextInput.addEventListener('focus', function (e) {
            if (isTextInput(e.target)) {
                _this.showTagInput();
            }
        });
        this.tagInputTextInput.addEventListener('blur', function (e) {
            if (isTextInput(e.target)) {
                _this.clearTagInput();
                if (_this.currentSelection.length) {
                    _this.hideTagInput();
                }
            }
        });
        // Focus the text input when the control container is clicked, which triggers
        // the show/hide behaviours defined in the handlers above
        this.tagInputContainer.addEventListener('click', function (e) {
            _this.focusTagInput();
        });
        // If the control already has some tags in it, hide the text input on load
        if (this.getHiddenInputValue() !== EmptyString) {
            this.hideTagInput();
        }
    }
    TagInput.prototype.getValue = function () {
        return this.getHiddenInputValue();
    };
    TagInput.prototype.addTag = function (label) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedTag, tag, newItem, tagTemplateData, tagHtml, selectedTagElement_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedTag = this.currentSelection.find(function (t) { return t.label === label; });
                        if (!!selectedTag) return [3 /*break*/, 3];
                        tag = this.data.find(function (t) { return t.label === label; });
                        if (!!tag) return [3 /*break*/, 2];
                        // If this input shouldn't allow new tags, just return now
                        if (!this.allowNewTags) {
                            // TODO: make the UX a bit better (red text? callback function to handle error?)
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.newItemFactory(label)];
                    case 1:
                        newItem = _a.sent();
                        tag = {
                            id: this.getId(newItem),
                            label: this.getLabel(newItem)
                        };
                        // Add the tag to the internal data source, so that if it's deleted and re-added again
                        // then we get it from there next time and don't create another new one
                        this.data.push(tag);
                        _a.label = 2;
                    case 2:
                        this.currentSelection.push(tag);
                        tagTemplateData = {
                            id: tag.id,
                            label: tag.label,
                            globalCssClassPrefix: this.globalCssClassPrefix
                        };
                        tagHtml = Mustache.render(this.itemTemplate, tagTemplateData);
                        // Insert the new tag before the hidden input
                        this.tagInputHiddenInput.insertAdjacentHTML('beforebegin', tagHtml);
                        this.clearTagInput();
                        this.hideSuggestions();
                        this.updateHiddenInput(this.currentSelection);
                        this.onTagAdded(this, [tag], this.currentSelection);
                        this.onTagsChanged(this, [tag], [], this.currentSelection);
                        return [3 /*break*/, 4];
                    case 3:
                        selectedTagElement_1 = this.tagInputContainer
                            .querySelector("." + this.globalCssClassPrefix + "-tag[data-label=\"" + selectedTag.label + "\"]");
                        selectedTagElement_1.classList.add(this.warningClass);
                        this.clearTagInput();
                        setTimeout(function () {
                            selectedTagElement_1.classList.remove(_this.warningClass);
                        }, 1500);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TagInput.prototype.getTextInputValue = function () {
        return this.tagInputTextInput.value.trim();
    };
    TagInput.prototype.getHiddenInputValue = function () {
        return this.tagInputHiddenInput.value.trim();
    };
    TagInput.prototype.showTagInput = function () {
        if (this.placeholderText) {
            this.tagInputTextInput.setAttribute('placeholder', this.placeholderText);
        }
        // Remove the narrowing class, restoring input to its original width
        this.tagInputTextInput.classList.remove(this.narrowedInputClass);
    };
    TagInput.prototype.focusTagInput = function () {
        this.tagInputTextInput.focus();
    };
    TagInput.prototype.hideTagInput = function () {
        if (this.getTextInputValue() === EmptyString) {
            this.tagInputTextInput.setAttribute('placeholder', EmptyString);
            // When the tag text input loses focus, add a class which narrows it
            // to 1px wide. This is to avoid odd visual effects when the tags in
            // the control wrap onto multiple lines
            this.tagInputTextInput.classList.add(this.narrowedInputClass);
        }
    };
    TagInput.prototype.clearTagInput = function () {
        this.tagInputTextInput.value = null;
    };
    TagInput.prototype.updateHiddenInput = function (data) {
        this.tagInputHiddenInput.value = data.map(function (t) { return t.id; }).join(this.tagDataSeparator);
    };
    TagInput.prototype.showSuggestions = function () {
        this.tagInputSuggestionDropdown.classList.remove(this.suggestionDropdownHiddenClass);
    };
    TagInput.prototype.hideSuggestions = function () {
        this.tagInputSuggestionDropdown.classList.add(this.suggestionDropdownHiddenClass);
    };
    TagInput.prototype.removeTag = function (tagElement) {
        var label = tagElement.getAttribute('data-label');
        var idx = this.currentSelection.findIndex(function (i) { return i.label === label; });
        var removedTag = this.currentSelection[idx];
        this.currentSelection.splice(idx, 1);
        tagElement.remove();
        this.updateHiddenInput(this.currentSelection);
        this.onTagRemoved(this, [removedTag], this.currentSelection);
        this.onTagsChanged(this, [], [removedTag], this.currentSelection);
    };
    return TagInput;
}());
exports.TagInput = TagInput;


/***/ }),

/***/ "./node_modules/mab-bootstrap-taginput/dist/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/mab-bootstrap-taginput/dist/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TagInput_1 = __webpack_require__(/*! ./TagInput */ "./node_modules/mab-bootstrap-taginput/dist/TagInput.js");
exports.TagInput = TagInput_1.TagInput;


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stylesInDom = {};

var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

function listToStyles(list, options) {
  var styles = [];
  var newStyles = {};

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var css = item[1];
    var media = item[2];
    var sourceMap = item[3];
    var part = {
      css: css,
      media: media,
      sourceMap: sourceMap
    };

    if (!newStyles[id]) {
      styles.push(newStyles[id] = {
        id: id,
        parts: [part]
      });
    } else {
      newStyles[id].parts.push(part);
    }
  }

  return styles;
}

function addStylesToDom(styles, options) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i];
    var domStyle = stylesInDom[item.id];
    var j = 0;

    if (domStyle) {
      domStyle.refs++;

      for (; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j]);
      }

      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j], options));
      }
    } else {
      var parts = [];

      for (; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j], options));
      }

      stylesInDom[item.id] = {
        id: item.id,
        refs: 1,
        parts: parts
      };
    }
  }
}

function insertStyleElement(options) {
  var style = document.createElement('style');

  if (typeof options.attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      options.attributes.nonce = nonce;
    }
  }

  Object.keys(options.attributes).forEach(function (key) {
    style.setAttribute(key, options.attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {};
  options.attributes = typeof options.attributes === 'object' ? options.attributes : {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  var styles = listToStyles(list, options);
  addStylesToDom(styles, options);
  return function update(newList) {
    var mayRemove = [];

    for (var i = 0; i < styles.length; i++) {
      var item = styles[i];
      var domStyle = stylesInDom[item.id];

      if (domStyle) {
        domStyle.refs--;
        mayRemove.push(domStyle);
      }
    }

    if (newList) {
      var newStyles = listToStyles(newList, options);
      addStylesToDom(newStyles, options);
    }

    for (var _i = 0; _i < mayRemove.length; _i++) {
      var _domStyle = mayRemove[_i];

      if (_domStyle.refs === 0) {
        for (var j = 0; j < _domStyle.parts.length; j++) {
          _domStyle.parts[j]();
        }

        delete stylesInDom[_domStyle.id];
      }
    }
  };
};

/***/ }),

/***/ "./wwwroot/js/tagmanager.ts":
/*!**********************************!*\
  !*** ./wwwroot/js/tagmanager.ts ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mab_bootstrap_taginput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mab-bootstrap-taginput */ "./node_modules/mab-bootstrap-taginput/dist/index.js");
/* harmony import */ var mab_bootstrap_taginput__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mab_bootstrap_taginput__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mab_bootstrap_taginput_css_standard_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mab-bootstrap-taginput/css/standard.css */ "./node_modules/mab-bootstrap-taginput/css/standard.css");
/* harmony import */ var mab_bootstrap_taginput_css_standard_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mab_bootstrap_taginput_css_standard_css__WEBPACK_IMPORTED_MODULE_1__);
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var e_1, _a;


var tagMergeInputElements = document.getElementsByClassName('tag-input-merge');
try {
    for (var tagMergeInputElements_1 = __values(tagMergeInputElements), tagMergeInputElements_1_1 = tagMergeInputElements_1.next(); !tagMergeInputElements_1_1.done; tagMergeInputElements_1_1 = tagMergeInputElements_1.next()) {
        var tagInputElement = tagMergeInputElements_1_1.value;
        new mab_bootstrap_taginput__WEBPACK_IMPORTED_MODULE_0__["TagInput"]({
            input: tagInputElement,
            data: _ALL_TAGS_MERGE || [],
            getId: function (item) { return item.id; },
            getLabel: function (item) { return item.label; },
            allowNewTags: false,
            minCharsBeforeShowingSuggestions: 1
        });
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (tagMergeInputElements_1_1 && !tagMergeInputElements_1_1.done && (_a = tagMergeInputElements_1.return)) _a.call(tagMergeInputElements_1);
    }
    finally { if (e_1) throw e_1.error; }
}


/***/ }),

/***/ "mustache":
/*!***************************!*\
  !*** external "Mustache" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = Mustache;

/***/ })

/******/ });
//# sourceMappingURL=tagmanager.js.map