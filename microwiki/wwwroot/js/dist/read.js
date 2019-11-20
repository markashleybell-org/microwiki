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
/******/ 	return __webpack_require__(__webpack_require__.s = "./wwwroot/js/read.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/highlight.js/lib/highlight.js":
/*!****************************************************!*\
  !*** ./node_modules/highlight.js/lib/highlight.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/

(function(factory) {

  // Find the global object for export to both the browser and web workers.
  var globalObject = typeof window === 'object' && window ||
                     typeof self === 'object' && self;

  // Setup highlight.js for different environments. First is Node.js or
  // CommonJS.
  // `nodeType` is checked to ensure that `exports` is not a HTML element.
  if( true && !exports.nodeType) {
    factory(exports);
  } else if(globalObject) {
    // Export hljs globally even when using AMD for cases when this script
    // is loaded with others that may still expect a global hljs.
    globalObject.hljs = factory({});

    // Finally register the global hljs with AMD.
    if(true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
        return globalObject.hljs;
      }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
  }

}(function(hljs) {
  // Convenience variables for build-in objects
  var ArrayProto = [],
      objectKeys = Object.keys;

  // Global internal variables used within the highlight.js library.
  var languages = {},
      aliases   = {};

  // Regular expressions used throughout the highlight.js library.
  var noHighlightRe    = /^(no-?highlight|plain|text)$/i,
      languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i,
      fixMarkupRe      = /((^(<[^>]+>|\t|)+|(?:\n)))/gm;

  // The object will be assigned by the build tool. It used to synchronize API 
  // of external language files with minified version of the highlight.js library.
  var API_REPLACES;

  var spanEndTag = '</span>';

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  var options = {
    classPrefix: 'hljs-',
    tabReplace: null,
    useBR: false,
    languages: undefined
  };


  /* Utility functions */

  function escape(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function tag(node) {
    return node.nodeName.toLowerCase();
  }

  function testRe(re, lexeme) {
    var match = re && re.exec(lexeme);
    return match && match.index === 0;
  }

  function isNotHighlighted(language) {
    return noHighlightRe.test(language);
  }

  function blockLanguage(block) {
    var i, match, length, _class;
    var classes = block.className + ' ';

    classes += block.parentNode ? block.parentNode.className : '';

    // language-* takes precedence over non-prefixed class names.
    match = languagePrefixRe.exec(classes);
    if (match) {
      return getLanguage(match[1]) ? match[1] : 'no-highlight';
    }

    classes = classes.split(/\s+/);

    for (i = 0, length = classes.length; i < length; i++) {
      _class = classes[i];

      if (isNotHighlighted(_class) || getLanguage(_class)) {
        return _class;
      }
    }
  }

  function inherit(parent) {  // inherit(parent, override_obj, override_obj, ...)
    var key;
    var result = {};
    var objects = Array.prototype.slice.call(arguments, 1);

    for (key in parent)
      result[key] = parent[key];
    objects.forEach(function(obj) {
      for (key in obj)
        result[key] = obj[key];
    });
    return result;
  }

  /* Stream merging */

  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node, offset) {
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === 3)
          offset += child.nodeValue.length;
        else if (child.nodeType === 1) {
          result.push({
            event: 'start',
            offset: offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          // Prevent void elements from having an end tag that would actually
          // double them in the output. There are more void elements in HTML
          // but we list only those realistically expected in code display.
          if (!tag(child).match(/br|hr|img|input/)) {
            result.push({
              event: 'stop',
              offset: offset,
              node: child
            });
          }
        }
      }
      return offset;
    })(node, 0);
    return result;
  }

  function mergeStreams(original, highlighted, value) {
    var processed = 0;
    var result = '';
    var nodeStack = [];

    function selectStream() {
      if (!original.length || !highlighted.length) {
        return original.length ? original : highlighted;
      }
      if (original[0].offset !== highlighted[0].offset) {
        return (original[0].offset < highlighted[0].offset) ? original : highlighted;
      }

      /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:

      if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;

      ... which is collapsed to:
      */
      return highlighted[0].event === 'start' ? original : highlighted;
    }

    function open(node) {
      function attr_str(a) {return ' ' + a.nodeName + '="' + escape(a.value).replace('"', '&quot;') + '"';}
      result += '<' + tag(node) + ArrayProto.map.call(node.attributes, attr_str).join('') + '>';
    }

    function close(node) {
      result += '</' + tag(node) + '>';
    }

    function render(event) {
      (event.event === 'start' ? open : close)(event.node);
    }

    while (original.length || highlighted.length) {
      var stream = selectStream();
      result += escape(value.substring(processed, stream[0].offset));
      processed = stream[0].offset;
      if (stream === original) {
        /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
        nodeStack.reverse().forEach(close);
        do {
          render(stream.splice(0, 1)[0]);
          stream = selectStream();
        } while (stream === original && stream.length && stream[0].offset === processed);
        nodeStack.reverse().forEach(open);
      } else {
        if (stream[0].event === 'start') {
          nodeStack.push(stream[0].node);
        } else {
          nodeStack.pop();
        }
        render(stream.splice(0, 1)[0]);
      }
    }
    return result + escape(value.substr(processed));
  }

  /* Initialization */

  function expand_mode(mode) {
    if (mode.variants && !mode.cached_variants) {
      mode.cached_variants = mode.variants.map(function(variant) {
        return inherit(mode, {variants: null}, variant);
      });
    }
    return mode.cached_variants || (mode.endsWithParent && [inherit(mode)]) || [mode];
  }

  function restoreLanguageApi(obj) {
    if(API_REPLACES && !obj.langApiRestored) {
      obj.langApiRestored = true;
      for(var key in API_REPLACES)
        obj[key] && (obj[API_REPLACES[key]] = obj[key]);
      (obj.contains || []).concat(obj.variants || []).forEach(restoreLanguageApi);
    }
  }

  function compileLanguage(language) {

    function reStr(re) {
        return (re && re.source) || re;
    }

    function langRe(value, global) {
      return new RegExp(
        reStr(value),
        'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
      );
    }

    // joinRe logically computes regexps.join(separator), but fixes the
    // backreferences so they continue to match.
    function joinRe(regexps, separator) {
      // backreferenceRe matches an open parenthesis or backreference. To avoid
      // an incorrect parse, it additionally matches the following:
      // - [...] elements, where the meaning of parentheses and escapes change
      // - other escape sequences, so we do not misparse escape sequences as
      //   interesting elements
      // - non-matching or lookahead parentheses, which do not capture. These
      //   follow the '(' with a '?'.
      var backreferenceRe = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
      var numCaptures = 0;
      var ret = '';
      for (var i = 0; i < regexps.length; i++) {
        var offset = numCaptures;
        var re = reStr(regexps[i]);
        if (i > 0) {
          ret += separator;
        }
        while (re.length > 0) {
          var match = backreferenceRe.exec(re);
          if (match == null) {
            ret += re;
            break;
          }
          ret += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] == '\\' && match[1]) {
            // Adjust the backreference.
            ret += '\\' + String(Number(match[1]) + offset);
          } else {
            ret += match[0];
            if (match[0] == '(') {
              numCaptures++;
            }
          }
        }
      }
      return ret;
    }

    function compileMode(mode, parent) {
      if (mode.compiled)
        return;
      mode.compiled = true;

      mode.keywords = mode.keywords || mode.beginKeywords;
      if (mode.keywords) {
        var compiled_keywords = {};

        var flatten = function(className, str) {
          if (language.case_insensitive) {
            str = str.toLowerCase();
          }
          str.split(' ').forEach(function(kw) {
            var pair = kw.split('|');
            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
          });
        };

        if (typeof mode.keywords === 'string') { // string
          flatten('keyword', mode.keywords);
        } else {
          objectKeys(mode.keywords).forEach(function (className) {
            flatten(className, mode.keywords[className]);
          });
        }
        mode.keywords = compiled_keywords;
      }
      mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);

      if (parent) {
        if (mode.beginKeywords) {
          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
        }
        if (!mode.begin)
          mode.begin = /\B|\b/;
        mode.beginRe = langRe(mode.begin);
        if (mode.endSameAsBegin)
          mode.end = mode.begin;
        if (!mode.end && !mode.endsWithParent)
          mode.end = /\B|\b/;
        if (mode.end)
          mode.endRe = langRe(mode.end);
        mode.terminator_end = reStr(mode.end) || '';
        if (mode.endsWithParent && parent.terminator_end)
          mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
      }
      if (mode.illegal)
        mode.illegalRe = langRe(mode.illegal);
      if (mode.relevance == null)
        mode.relevance = 1;
      if (!mode.contains) {
        mode.contains = [];
      }
      mode.contains = Array.prototype.concat.apply([], mode.contains.map(function(c) {
        return expand_mode(c === 'self' ? mode : c);
      }));
      mode.contains.forEach(function(c) {compileMode(c, mode);});

      if (mode.starts) {
        compileMode(mode.starts, parent);
      }

      var terminators =
        mode.contains.map(function(c) {
          return c.beginKeywords ? '\\.?(?:' + c.begin + ')\\.?' : c.begin;
        })
        .concat([mode.terminator_end, mode.illegal])
        .map(reStr)
        .filter(Boolean);
      mode.terminators = terminators.length ? langRe(joinRe(terminators, '|'), true) : {exec: function(/*s*/) {return null;}};
    }
    
    compileMode(language);
  }

  /*
  Core highlighting function. Accepts a language name, or an alias, and a
  string with the code to highlight. Returns an object with the following
  properties:

  - relevance (int)
  - value (an HTML string with highlighting markup)

  */
  function highlight(name, value, ignore_illegals, continuation) {

    function escapeRe(value) {
      return new RegExp(value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'm');
    }

    function subMode(lexeme, mode) {
      var i, length;

      for (i = 0, length = mode.contains.length; i < length; i++) {
        if (testRe(mode.contains[i].beginRe, lexeme)) {
          if (mode.contains[i].endSameAsBegin) {
            mode.contains[i].endRe = escapeRe( mode.contains[i].beginRe.exec(lexeme)[0] );
          }
          return mode.contains[i];
        }
      }
    }

    function endOfMode(mode, lexeme) {
      if (testRe(mode.endRe, lexeme)) {
        while (mode.endsParent && mode.parent) {
          mode = mode.parent;
        }
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexeme);
      }
    }

    function isIllegal(lexeme, mode) {
      return !ignore_illegals && testRe(mode.illegalRe, lexeme);
    }

    function keywordMatch(mode, match) {
      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
    }

    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
      var classPrefix = noPrefix ? '' : options.classPrefix,
          openSpan    = '<span class="' + classPrefix,
          closeSpan   = leaveOpen ? '' : spanEndTag;

      openSpan += classname + '">';

      if (!classname) return insideSpan;
      return openSpan + insideSpan + closeSpan;
    }

    function processKeywords() {
      var keyword_match, last_index, match, result;

      if (!top.keywords)
        return escape(mode_buffer);

      result = '';
      last_index = 0;
      top.lexemesRe.lastIndex = 0;
      match = top.lexemesRe.exec(mode_buffer);

      while (match) {
        result += escape(mode_buffer.substring(last_index, match.index));
        keyword_match = keywordMatch(top, match);
        if (keyword_match) {
          relevance += keyword_match[1];
          result += buildSpan(keyword_match[0], escape(match[0]));
        } else {
          result += escape(match[0]);
        }
        last_index = top.lexemesRe.lastIndex;
        match = top.lexemesRe.exec(mode_buffer);
      }
      return result + escape(mode_buffer.substr(last_index));
    }

    function processSubLanguage() {
      var explicit = typeof top.subLanguage === 'string';
      if (explicit && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }

      var result = explicit ?
                   highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) :
                   highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : undefined);

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      if (explicit) {
        continuations[top.subLanguage] = result.top;
      }
      return buildSpan(result.language, result.value, false, true);
    }

    function processBuffer() {
      result += (top.subLanguage != null ? processSubLanguage() : processKeywords());
      mode_buffer = '';
    }

    function startNewMode(mode) {
      result += mode.className? buildSpan(mode.className, '', true): '';
      top = Object.create(mode, {parent: {value: top}});
    }

    function processLexeme(buffer, lexeme) {

      mode_buffer += buffer;

      if (lexeme == null) {
        processBuffer();
        return 0;
      }

      var new_mode = subMode(lexeme, top);
      if (new_mode) {
        if (new_mode.skip) {
          mode_buffer += lexeme;
        } else {
          if (new_mode.excludeBegin) {
            mode_buffer += lexeme;
          }
          processBuffer();
          if (!new_mode.returnBegin && !new_mode.excludeBegin) {
            mode_buffer = lexeme;
          }
        }
        startNewMode(new_mode, lexeme);
        return new_mode.returnBegin ? 0 : lexeme.length;
      }

      var end_mode = endOfMode(top, lexeme);
      if (end_mode) {
        var origin = top;
        if (origin.skip) {
          mode_buffer += lexeme;
        } else {
          if (!(origin.returnEnd || origin.excludeEnd)) {
            mode_buffer += lexeme;
          }
          processBuffer();
          if (origin.excludeEnd) {
            mode_buffer = lexeme;
          }
        }
        do {
          if (top.className) {
            result += spanEndTag;
          }
          if (!top.skip && !top.subLanguage) {
            relevance += top.relevance;
          }
          top = top.parent;
        } while (top !== end_mode.parent);
        if (end_mode.starts) {
          if (end_mode.endSameAsBegin) {
            end_mode.starts.endRe = end_mode.endRe;
          }
          startNewMode(end_mode.starts, '');
        }
        return origin.returnEnd ? 0 : lexeme.length;
      }

      if (isIllegal(lexeme, top))
        throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');

      /*
      Parser should not reach this point as all types of lexemes should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
      mode_buffer += lexeme;
      return lexeme.length || 1;
    }

    var language = getLanguage(name);
    if (!language) {
      throw new Error('Unknown language: "' + name + '"');
    }

    compileLanguage(language);
    var top = continuation || language;
    var continuations = {}; // keep continuations for sub-languages
    var result = '', current;
    for(current = top; current !== language; current = current.parent) {
      if (current.className) {
        result = buildSpan(current.className, '', true) + result;
      }
    }
    var mode_buffer = '';
    var relevance = 0;
    try {
      var match, count, index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(value);
        if (!match)
          break;
        count = processLexeme(value.substring(index, match.index), match[0]);
        index = match.index + count;
      }
      processLexeme(value.substr(index));
      for(current = top; current.parent; current = current.parent) { // close dangling modes
        if (current.className) {
          result += spanEndTag;
        }
      }
      return {
        relevance: relevance,
        value: result,
        language: name,
        top: top
      };
    } catch (e) {
      if (e.message && e.message.indexOf('Illegal') !== -1) {
        return {
          relevance: 0,
          value: escape(value)
        };
      } else {
        throw e;
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)

  */
  function highlightAuto(text, languageSubset) {
    languageSubset = languageSubset || options.languages || objectKeys(languages);
    var result = {
      relevance: 0,
      value: escape(text)
    };
    var second_best = result;
    languageSubset.filter(getLanguage).filter(autoDetection).forEach(function(name) {
      var current = highlight(name, text, false);
      current.language = name;
      if (current.relevance > second_best.relevance) {
        second_best = current;
      }
      if (current.relevance > result.relevance) {
        second_best = result;
        result = current;
      }
    });
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }

  /*
  Post-processing of the highlighted markup:

  - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers

  */
  function fixMarkup(value) {
    return !(options.tabReplace || options.useBR)
      ? value
      : value.replace(fixMarkupRe, function(match, p1) {
          if (options.useBR && match === '\n') {
            return '<br>';
          } else if (options.tabReplace) {
            return p1.replace(/\t/g, options.tabReplace);
          }
          return '';
      });
  }

  function buildClassName(prevClassName, currentLang, resultLang) {
    var language = currentLang ? aliases[currentLang] : resultLang,
        result   = [prevClassName.trim()];

    if (!prevClassName.match(/\bhljs\b/)) {
      result.push('hljs');
    }

    if (prevClassName.indexOf(language) === -1) {
      result.push(language);
    }

    return result.join(' ').trim();
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block) {
    var node, originalStream, result, resultNode, text;
    var language = blockLanguage(block);

    if (isNotHighlighted(language))
        return;

    if (options.useBR) {
      node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n');
    } else {
      node = block;
    }
    text = node.textContent;
    result = language ? highlight(language, text, true) : highlightAuto(text);

    originalStream = nodeStream(node);
    if (originalStream.length) {
      resultNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      resultNode.innerHTML = result.value;
      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
    }
    result.value = fixMarkup(result.value);

    block.innerHTML = result.value;
    block.className = buildClassName(block.className, language, result.language);
    block.result = {
      language: result.language,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        re: result.second_best.relevance
      };
    }
  }

  /*
  Updates highlight.js global options with values passed in the form of an object.
  */
  function configure(user_options) {
    options = inherit(options, user_options);
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called)
      return;
    initHighlighting.called = true;

    var blocks = document.querySelectorAll('pre code');
    ArrayProto.forEach.call(blocks, highlightBlock);
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    addEventListener('DOMContentLoaded', initHighlighting, false);
    addEventListener('load', initHighlighting, false);
  }

  function registerLanguage(name, language) {
    var lang = languages[name] = language(hljs);
    restoreLanguageApi(lang);
    if (lang.aliases) {
      lang.aliases.forEach(function(alias) {aliases[alias] = name;});
    }
  }

  function listLanguages() {
    return objectKeys(languages);
  }

  function getLanguage(name) {
    name = (name || '').toLowerCase();
    return languages[name] || languages[aliases[name]];
  }

  function autoDetection(name) {
    var lang = getLanguage(name);
    return lang && !lang.disableAutodetect;
  }

  /* Interface definition */

  hljs.highlight = highlight;
  hljs.highlightAuto = highlightAuto;
  hljs.fixMarkup = fixMarkup;
  hljs.highlightBlock = highlightBlock;
  hljs.configure = configure;
  hljs.initHighlighting = initHighlighting;
  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
  hljs.registerLanguage = registerLanguage;
  hljs.listLanguages = listLanguages;
  hljs.getLanguage = getLanguage;
  hljs.autoDetection = autoDetection;
  hljs.inherit = inherit;

  // Common regexps
  hljs.IDENT_RE = '[a-zA-Z]\\w*';
  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
  hljs.C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
  hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

  // Common modes
  hljs.BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]', relevance: 0
  };
  hljs.APOS_STRING_MODE = {
    className: 'string',
    begin: '\'', end: '\'',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.QUOTE_STRING_MODE = {
    className: 'string',
    begin: '"', end: '"',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  };
  hljs.COMMENT = function (begin, end, inherits) {
    var mode = hljs.inherit(
      {
        className: 'comment',
        begin: begin, end: end,
        contains: []
      },
      inherits || {}
    );
    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
    mode.contains.push({
      className: 'doctag',
      begin: '(?:TODO|FIXME|NOTE|BUG|XXX):',
      relevance: 0
    });
    return mode;
  };
  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
  hljs.NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE,
    relevance: 0
  };
  hljs.C_NUMBER_MODE = {
    className: 'number',
    begin: hljs.C_NUMBER_RE,
    relevance: 0
  };
  hljs.BINARY_NUMBER_MODE = {
    className: 'number',
    begin: hljs.BINARY_NUMBER_RE,
    relevance: 0
  };
  hljs.CSS_NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE + '(' +
      '%|em|ex|ch|rem'  +
      '|vw|vh|vmin|vmax' +
      '|cm|mm|in|pt|pc|px' +
      '|deg|grad|rad|turn' +
      '|s|ms' +
      '|Hz|kHz' +
      '|dpi|dpcm|dppx' +
      ')?',
    relevance: 0
  };
  hljs.REGEXP_MODE = {
    className: 'regexp',
    begin: /\//, end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      {
        begin: /\[/, end: /\]/,
        relevance: 0,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };
  hljs.TITLE_MODE = {
    className: 'title',
    begin: hljs.IDENT_RE,
    relevance: 0
  };
  hljs.UNDERSCORE_TITLE_MODE = {
    className: 'title',
    begin: hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  hljs.METHOD_GUARD = {
    // excludes method names from keyword processing
    begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };

  return hljs;
}));


/***/ }),

/***/ "./node_modules/highlight.js/lib/languages/cs.js":
/*!*******************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/cs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(hljs) {
  var KEYWORDS = {
    keyword:
      // Normal keywords.
      'abstract as base bool break byte case catch char checked const continue decimal ' +
      'default delegate do double enum event explicit extern finally fixed float ' +
      'for foreach goto if implicit in int interface internal is lock long nameof ' +
      'object operator out override params private protected public readonly ref sbyte ' +
      'sealed short sizeof stackalloc static string struct switch this try typeof ' +
      'uint ulong unchecked unsafe ushort using virtual void volatile while ' +
      // Contextual keywords.
      'add alias ascending async await by descending dynamic equals from get global group into join ' +
      'let on orderby partial remove select set value var where yield',
    literal:
      'null false true'
  };
  var NUMBERS = {
    className: 'number',
    variants: [
      { begin: '\\b(0b[01\']+)' },
      { begin: '(-?)\\b([\\d\']+(\\.[\\d\']*)?|\\.[\\d\']+)(u|U|l|L|ul|UL|f|F|b|B)' },
      { begin: '(-?)(\\b0[xX][a-fA-F0-9\']+|(\\b[\\d\']+(\\.[\\d\']*)?|\\.[\\d\']+)([eE][-+]?[\\d\']+)?)' }
    ],
    relevance: 0
  };
  var VERBATIM_STRING = {
    className: 'string',
    begin: '@"', end: '"',
    contains: [{begin: '""'}]
  };
  var VERBATIM_STRING_NO_LF = hljs.inherit(VERBATIM_STRING, {illegal: /\n/});
  var SUBST = {
    className: 'subst',
    begin: '{', end: '}',
    keywords: KEYWORDS
  };
  var SUBST_NO_LF = hljs.inherit(SUBST, {illegal: /\n/});
  var INTERPOLATED_STRING = {
    className: 'string',
    begin: /\$"/, end: '"',
    illegal: /\n/,
    contains: [{begin: '{{'}, {begin: '}}'}, hljs.BACKSLASH_ESCAPE, SUBST_NO_LF]
  };
  var INTERPOLATED_VERBATIM_STRING = {
    className: 'string',
    begin: /\$@"/, end: '"',
    contains: [{begin: '{{'}, {begin: '}}'}, {begin: '""'}, SUBST]
  };
  var INTERPOLATED_VERBATIM_STRING_NO_LF = hljs.inherit(INTERPOLATED_VERBATIM_STRING, {
    illegal: /\n/,
    contains: [{begin: '{{'}, {begin: '}}'}, {begin: '""'}, SUBST_NO_LF]
  });
  SUBST.contains = [
    INTERPOLATED_VERBATIM_STRING,
    INTERPOLATED_STRING,
    VERBATIM_STRING,
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    NUMBERS,
    hljs.C_BLOCK_COMMENT_MODE
  ];
  SUBST_NO_LF.contains = [
    INTERPOLATED_VERBATIM_STRING_NO_LF,
    INTERPOLATED_STRING,
    VERBATIM_STRING_NO_LF,
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    NUMBERS,
    hljs.inherit(hljs.C_BLOCK_COMMENT_MODE, {illegal: /\n/})
  ];
  var STRING = {
    variants: [
      INTERPOLATED_VERBATIM_STRING,
      INTERPOLATED_STRING,
      VERBATIM_STRING,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE
    ]
  };

  var TYPE_IDENT_RE = hljs.IDENT_RE + '(<' + hljs.IDENT_RE + '(\\s*,\\s*' + hljs.IDENT_RE + ')*>)?(\\[\\])?';

  return {
    aliases: ['csharp', 'c#'],
    keywords: KEYWORDS,
    illegal: /::/,
    contains: [
      hljs.COMMENT(
        '///',
        '$',
        {
          returnBegin: true,
          contains: [
            {
              className: 'doctag',
              variants: [
                {
                  begin: '///', relevance: 0
                },
                {
                  begin: '<!--|-->'
                },
                {
                  begin: '</?', end: '>'
                }
              ]
            }
          ]
        }
      ),
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'meta',
        begin: '#', end: '$',
        keywords: {
          'meta-keyword': 'if else elif endif define undef warning error line region endregion pragma checksum'
        }
      },
      STRING,
      NUMBERS,
      {
        beginKeywords: 'class interface', end: /[{;=]/,
        illegal: /[^\s:,]/,
        contains: [
          hljs.TITLE_MODE,
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      },
      {
        beginKeywords: 'namespace', end: /[{;=]/,
        illegal: /[^\s:]/,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {begin: '[a-zA-Z](\\.?\\w)*'}),
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      },
      {
        // [Attributes("")]
        className: 'meta',
        begin: '^\\s*\\[', excludeBegin: true, end: '\\]', excludeEnd: true,
        contains: [
          {className: 'meta-string', begin: /"/, end: /"/}
        ]
      },
      {
        // Expression keywords prevent 'keyword Name(...)' from being
        // recognized as a function definition
        beginKeywords: 'new return throw await else',
        relevance: 0
      },
      {
        className: 'function',
        begin: '(' + TYPE_IDENT_RE + '\\s+)+' + hljs.IDENT_RE + '\\s*\\(', returnBegin: true,
        end: /\s*[{;=]/, excludeEnd: true,
        keywords: KEYWORDS,
        contains: [
          {
            begin: hljs.IDENT_RE + '\\s*\\(', returnBegin: true,
            contains: [hljs.TITLE_MODE],
            relevance: 0
          },
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            keywords: KEYWORDS,
            relevance: 0,
            contains: [
              STRING,
              NUMBERS,
              hljs.C_BLOCK_COMMENT_MODE
            ]
          },
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      }
    ]
  };
};

/***/ }),

/***/ "./node_modules/highlight.js/lib/languages/css.js":
/*!********************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/css.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(hljs) {
  var IDENT_RE = '[a-zA-Z-][a-zA-Z0-9_-]*';
  var RULE = {
    begin: /(?:[A-Z\_\.\-]+|--[a-zA-Z0-9_-]+)\s*:/, returnBegin: true, end: ';', endsWithParent: true,
    contains: [
      {
        className: 'attribute',
        begin: /\S/, end: ':', excludeEnd: true,
        starts: {
          endsWithParent: true, excludeEnd: true,
          contains: [
            {
              begin: /[\w-]+\(/, returnBegin: true,
              contains: [
                {
                  className: 'built_in',
                  begin: /[\w-]+/
                },
                {
                  begin: /\(/, end: /\)/,
                  contains: [
                    hljs.APOS_STRING_MODE,
                    hljs.QUOTE_STRING_MODE
                  ]
                }
              ]
            },
            hljs.CSS_NUMBER_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            {
              className: 'number', begin: '#[0-9A-Fa-f]+'
            },
            {
              className: 'meta', begin: '!important'
            }
          ]
        }
      }
    ]
  };

  return {
    case_insensitive: true,
    illegal: /[=\/|'\$]/,
    contains: [
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'selector-id', begin: /#[A-Za-z0-9_-]+/
      },
      {
        className: 'selector-class', begin: /\.[A-Za-z0-9_-]+/
      },
      {
        className: 'selector-attr',
        begin: /\[/, end: /\]/,
        illegal: '$'
      },
      {
        className: 'selector-pseudo',
        begin: /:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/
      },
      {
        begin: '@(font-face|page)',
        lexemes: '[a-z-]+',
        keywords: 'font-face page'
      },
      {
        begin: '@', end: '[{;]', // at_rule eating first "{" is a good thing
                                 // because it doesn’t let it to be parsed as
                                 // a rule set but instead drops parser into
                                 // the default mode which is how it should be.
        illegal: /:/, // break on Less variables @var: ...
        contains: [
          {
            className: 'keyword',
            begin: /\w+/
          },
          {
            begin: /\s/, endsWithParent: true, excludeEnd: true,
            relevance: 0,
            contains: [
              hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE,
              hljs.CSS_NUMBER_MODE
            ]
          }
        ]
      },
      {
        className: 'selector-tag', begin: IDENT_RE,
        relevance: 0
      },
      {
        begin: '{', end: '}',
        illegal: /\S/,
        contains: [
          hljs.C_BLOCK_COMMENT_MODE,
          RULE,
        ]
      }
    ]
  };
};

/***/ }),

/***/ "./node_modules/highlight.js/lib/languages/javascript.js":
/*!***************************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/javascript.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(hljs) {
  var IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
  var KEYWORDS = {
    keyword:
      'in of if for while finally var new function do return void else break catch ' +
      'instanceof with throw case default try this switch continue typeof delete ' +
      'let yield const export super debugger as async await static ' +
      // ECMAScript 6 modules import
      'import from as'
    ,
    literal:
      'true false null undefined NaN Infinity',
    built_in:
      'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
      'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
      'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
      'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
      'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
      'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' +
      'module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect ' +
      'Promise'
  };
  var NUMBER = {
    className: 'number',
    variants: [
      { begin: '\\b(0[bB][01]+)' },
      { begin: '\\b(0[oO][0-7]+)' },
      { begin: hljs.C_NUMBER_RE }
    ],
    relevance: 0
  };
  var SUBST = {
    className: 'subst',
    begin: '\\$\\{', end: '\\}',
    keywords: KEYWORDS,
    contains: []  // defined later
  };
  var HTML_TEMPLATE = {
    begin: 'html`', end: '',
    starts: {
      end: '`', returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: 'xml',
    }
  };
  var CSS_TEMPLATE = {
    begin: 'css`', end: '',
    starts: {
      end: '`', returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: 'css',
    }
  };
  var TEMPLATE_STRING = {
    className: 'string',
    begin: '`', end: '`',
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  SUBST.contains = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    TEMPLATE_STRING,
    NUMBER,
    hljs.REGEXP_MODE
  ];
  var PARAMS_CONTAINS = SUBST.contains.concat([
    hljs.C_BLOCK_COMMENT_MODE,
    hljs.C_LINE_COMMENT_MODE
  ]);

  return {
    aliases: ['js', 'jsx'],
    keywords: KEYWORDS,
    contains: [
      {
        className: 'meta',
        relevance: 10,
        begin: /^\s*['"]use (strict|asm)['"]/
      },
      {
        className: 'meta',
        begin: /^#!/, end: /$/
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      TEMPLATE_STRING,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      NUMBER,
      { // object attr container
        begin: /[{,]\s*/, relevance: 0,
        contains: [
          {
            begin: IDENT_RE + '\\s*:', returnBegin: true,
            relevance: 0,
            contains: [{className: 'attr', begin: IDENT_RE, relevance: 0}]
          }
        ]
      },
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.REGEXP_MODE,
          {
            className: 'function',
            begin: '(\\(.*?\\)|' + IDENT_RE + ')\\s*=>', returnBegin: true,
            end: '\\s*=>',
            contains: [
              {
                className: 'params',
                variants: [
                  {
                    begin: IDENT_RE
                  },
                  {
                    begin: /\(\s*\)/,
                  },
                  {
                    begin: /\(/, end: /\)/,
                    excludeBegin: true, excludeEnd: true,
                    keywords: KEYWORDS,
                    contains: PARAMS_CONTAINS
                  }
                ]
              }
            ]
          },
          {
            className: '',
            begin: /\s/,
            end: /\s*/,
            skip: true,
          },
          { // E4X / JSX
            begin: /</, end: /(\/[A-Za-z0-9\\._:-]+|[A-Za-z0-9\\._:-]+\/)>/,
            subLanguage: 'xml',
            contains: [
              { begin: /<[A-Za-z0-9\\._:-]+\s*\/>/, skip: true },
              {
                begin: /<[A-Za-z0-9\\._:-]+/, end: /(\/[A-Za-z0-9\\._:-]+|[A-Za-z0-9\\._:-]+\/)>/, skip: true,
                contains: [
                  { begin: /<[A-Za-z0-9\\._:-]+\s*\/>/, skip: true },
                  'self'
                ]
              }
            ]
          }
        ],
        relevance: 0
      },
      {
        className: 'function',
        beginKeywords: 'function', end: /\{/, excludeEnd: true,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {begin: IDENT_RE}),
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            contains: PARAMS_CONTAINS
          }
        ],
        illegal: /\[|%/
      },
      {
        begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      },
      hljs.METHOD_GUARD,
      { // ES6 class
        className: 'class',
        beginKeywords: 'class', end: /[{;=]/, excludeEnd: true,
        illegal: /[:"\[\]]/,
        contains: [
          {beginKeywords: 'extends'},
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      {
        beginKeywords: 'constructor get set', end: /\{/, excludeEnd: true
      }
    ],
    illegal: /#(?!!)/
  };
};

/***/ }),

/***/ "./node_modules/highlight.js/lib/languages/plaintext.js":
/*!**************************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/plaintext.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(hljs) {
    return {
        disableAutodetect: true
    };
};

/***/ }),

/***/ "./node_modules/highlight.js/lib/languages/powershell.js":
/*!***************************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/powershell.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(hljs){
  var BACKTICK_ESCAPE = {
    begin: "`[\\s\\S]",
    relevance: 0,
  };
  var VAR = {
    className: "variable",
    variants: [{ begin: /\$[\w\d][\w\d_:]*/ }],
  };
  var LITERAL = {
    className: "literal",
    begin: /\$(null|true|false)\b/,
  };
  var QUOTE_STRING = {
    className: "string",
    variants: [{ begin: /"/, end: /"/ }, { begin: /@"/, end: /^"@/ }],
    contains: [
      BACKTICK_ESCAPE,
      VAR,
      {
        className: "variable",
        begin: /\$[A-z]/,
        end: /[^A-z]/,
      },
    ],
  };
  var APOS_STRING = {
    className: "string",
    variants: [{ begin: /'/, end: /'/ }, { begin: /@'/, end: /^'@/ }],
  };

  var PS_HELPTAGS = {
    className: "doctag",
    variants: [
      /* no paramater help tags */

      {
        begin: /\.(synopsis|description|example|inputs|outputs|notes|link|component|role|functionality)/,
      },
      /* one parameter help tags */
      {
        begin: /\.(parameter|forwardhelptargetname|forwardhelpcategory|remotehelprunspace|externalhelp)\s+\S+/,
      },
    ],
  };
  var PS_COMMENT = hljs.inherit(hljs.COMMENT(null, null), {
    variants: [
      /* single-line comment */
      { begin: /#/, end: /$/ },
      /* multi-line comment */
      { begin: /<#/, end: /#>/ },
    ],
    contains: [PS_HELPTAGS],
  });

  return {
    aliases: ["ps"],
    lexemes: /-?[A-z\.\-]+/,
    case_insensitive: true,
    keywords: {
      keyword:
        "if else foreach return function do while until elseif begin for trap data dynamicparam end break throw param continue finally in switch exit filter try process catch" +
        "ValidateNoCircleInNodeResources ValidateNodeExclusiveResources ValidateNodeManager ValidateNodeResources ValidateNodeResourceSource ValidateNoNameNodeResources ThrowError IsHiddenResource" +
        "IsPatternMatched ",
      built_in:
        "Add-Computer Add-Content Add-History Add-JobTrigger Add-Member Add-PSSnapin Add-Type Checkpoint-Computer Clear-Content " +
        "Clear-EventLog Clear-History Clear-Host Clear-Item Clear-ItemProperty Clear-Variable Compare-Object Complete-Transaction Connect-PSSession " +
        "Connect-WSMan Convert-Path ConvertFrom-Csv ConvertFrom-Json ConvertFrom-SecureString ConvertFrom-StringData ConvertTo-Csv ConvertTo-Html " +
        "ConvertTo-Json ConvertTo-SecureString ConvertTo-Xml Copy-Item Copy-ItemProperty Debug-Process Disable-ComputerRestore Disable-JobTrigger " +
        "Disable-PSBreakpoint Disable-PSRemoting Disable-PSSessionConfiguration Disable-WSManCredSSP Disconnect-PSSession Disconnect-WSMan " +
        "Disable-ScheduledJob Enable-ComputerRestore Enable-JobTrigger Enable-PSBreakpoint Enable-PSRemoting Enable-PSSessionConfiguration " +
        "Enable-ScheduledJob Enable-WSManCredSSP Enter-PSSession Exit-PSSession Export-Alias Export-Clixml Export-Console Export-Counter Export-Csv " +
        "Export-FormatData Export-ModuleMember Export-PSSession ForEach-Object Format-Custom Format-List Format-Table Format-Wide Get-Acl Get-Alias " +
        "Get-AuthenticodeSignature Get-ChildItem Get-Command Get-ComputerRestorePoint Get-Content Get-ControlPanelItem Get-Counter Get-Credential " +
        "Get-Culture Get-Date Get-Event Get-EventLog Get-EventSubscriber Get-ExecutionPolicy Get-FormatData Get-Host Get-HotFix Get-Help Get-History " +
        "Get-IseSnippet Get-Item Get-ItemProperty Get-Job Get-JobTrigger Get-Location Get-Member Get-Module Get-PfxCertificate Get-Process " +
        "Get-PSBreakpoint Get-PSCallStack Get-PSDrive Get-PSProvider Get-PSSession Get-PSSessionConfiguration Get-PSSnapin Get-Random Get-ScheduledJob " +
        "Get-ScheduledJobOption Get-Service Get-TraceSource Get-Transaction Get-TypeData Get-UICulture Get-Unique Get-Variable Get-Verb Get-WinEvent " +
        "Get-WmiObject Get-WSManCredSSP Get-WSManInstance Group-Object Import-Alias Import-Clixml Import-Counter Import-Csv Import-IseSnippet " +
        "Import-LocalizedData Import-PSSession Import-Module Invoke-AsWorkflow Invoke-Command Invoke-Expression Invoke-History Invoke-Item " +
        "Invoke-RestMethod Invoke-WebRequest Invoke-WmiMethod Invoke-WSManAction Join-Path Limit-EventLog Measure-Command Measure-Object Move-Item " +
        "Move-ItemProperty New-Alias New-Event New-EventLog New-IseSnippet New-Item New-ItemProperty New-JobTrigger New-Object New-Module " +
        "New-ModuleManifest New-PSDrive New-PSSession New-PSSessionConfigurationFile New-PSSessionOption New-PSTransportOption " +
        "New-PSWorkflowExecutionOption New-PSWorkflowSession New-ScheduledJobOption New-Service New-TimeSpan New-Variable New-WebServiceProxy " +
        "New-WinEvent New-WSManInstance New-WSManSessionOption Out-Default Out-File Out-GridView Out-Host Out-Null Out-Printer Out-String Pop-Location " +
        "Push-Location Read-Host Receive-Job Register-EngineEvent Register-ObjectEvent Register-PSSessionConfiguration Register-ScheduledJob " +
        "Register-WmiEvent Remove-Computer Remove-Event Remove-EventLog Remove-Item Remove-ItemProperty Remove-Job Remove-JobTrigger Remove-Module " +
        "Remove-PSBreakpoint Remove-PSDrive Remove-PSSession Remove-PSSnapin Remove-TypeData Remove-Variable Remove-WmiObject Remove-WSManInstance " +
        "Rename-Computer Rename-Item Rename-ItemProperty Reset-ComputerMachinePassword Resolve-Path Restart-Computer Restart-Service Restore-Computer " +
        "Resume-Job Resume-Service Save-Help Select-Object Select-String Select-Xml Send-MailMessage Set-Acl Set-Alias Set-AuthenticodeSignature " +
        "Set-Content Set-Date Set-ExecutionPolicy Set-Item Set-ItemProperty Set-JobTrigger Set-Location Set-PSBreakpoint Set-PSDebug " +
        "Set-PSSessionConfiguration Set-ScheduledJob Set-ScheduledJobOption Set-Service Set-StrictMode Set-TraceSource Set-Variable Set-WmiInstance " +
        "Set-WSManInstance Set-WSManQuickConfig Show-Command Show-ControlPanelItem Show-EventLog Sort-Object Split-Path Start-Job Start-Process " +
        "Start-Service Start-Sleep Start-Transaction Start-Transcript Stop-Computer Stop-Job Stop-Process Stop-Service Stop-Transcript Suspend-Job " +
        "Suspend-Service Tee-Object Test-ComputerSecureChannel Test-Connection Test-ModuleManifest Test-Path Test-PSSessionConfigurationFile " +
        "Trace-Command Unblock-File Undo-Transaction Unregister-Event Unregister-PSSessionConfiguration Unregister-ScheduledJob Update-FormatData " +
        "Update-Help Update-List Update-TypeData Use-Transaction Wait-Event Wait-Job Wait-Process Where-Object Write-Debug Write-Error Write-EventLog " +
        "Write-Host Write-Output Write-Progress Write-Verbose Write-Warning Add-MDTPersistentDrive Disable-MDTMonitorService Enable-MDTMonitorService " +
        "Get-MDTDeploymentShareStatistics Get-MDTMonitorData Get-MDTOperatingSystemCatalog Get-MDTPersistentDrive Import-MDTApplication " +
        "Import-MDTDriver Import-MDTOperatingSystem Import-MDTPackage Import-MDTTaskSequence New-MDTDatabase Remove-MDTMonitorData " +
        "Remove-MDTPersistentDrive Restore-MDTPersistentDrive Set-MDTMonitorData Test-MDTDeploymentShare Test-MDTMonitorData Update-MDTDatabaseSchema " +
        "Update-MDTDeploymentShare Update-MDTLinkedDS Update-MDTMedia Add-VamtProductKey Export-VamtData Find-VamtManagedMachine " +
        "Get-VamtConfirmationId Get-VamtProduct Get-VamtProductKey Import-VamtData Initialize-VamtData Install-VamtConfirmationId " +
        "Install-VamtProductActivation Install-VamtProductKey Update-VamtProduct Add-CIDatastore Add-KeyManagementServer Add-NodeKeys " +
        "Add-NsxDynamicCriteria Add-NsxDynamicMemberSet Add-NsxEdgeInterfaceAddress Add-NsxFirewallExclusionListMember Add-NsxFirewallRuleMember " +
        "Add-NsxIpSetMember Add-NsxLicense Add-NsxLoadBalancerPoolMember Add-NsxLoadBalancerVip Add-NsxSecondaryManager Add-NsxSecurityGroupMember " +
        "Add-NsxSecurityPolicyRule Add-NsxSecurityPolicyRuleGroup Add-NsxSecurityPolicyRuleService Add-NsxServiceGroupMember " +
        "Add-NsxTransportZoneMember Add-PassthroughDevice Add-VDSwitchPhysicalNetworkAdapter Add-VDSwitchVMHost Add-VMHost Add-VMHostNtpServer " +
        "Add-VirtualSwitchPhysicalNetworkAdapter Add-XmlElement Add-vRACustomForm Add-vRAPrincipalToTenantRole Add-vRAReservationNetwork " +
        "Add-vRAReservationStorage Clear-NsxEdgeInterface Clear-NsxManagerTimeSettings Compress-Archive Connect-CIServer Connect-CisServer " +
        "Connect-HCXServer Connect-NIServer Connect-NsxLogicalSwitch Connect-NsxServer Connect-NsxtServer Connect-SrmServer Connect-VIServer " +
        "Connect-Vmc Connect-vRAServer Connect-vRNIServer ConvertFrom-Markdown ConvertTo-MOFInstance Copy-DatastoreItem Copy-HardDisk Copy-NsxEdge " +
        "Copy-VDisk Copy-VMGuestFile Debug-Runspace Disable-NsxEdgeSsh Disable-RunspaceDebug Disable-vRNIDataSource Disconnect-CIServer " +
        "Disconnect-CisServer Disconnect-HCXServer Disconnect-NsxLogicalSwitch Disconnect-NsxServer Disconnect-NsxtServer Disconnect-SrmServer " +
        "Disconnect-VIServer Disconnect-Vmc Disconnect-vRAServer Disconnect-vRNIServer Dismount-Tools Enable-NsxEdgeSsh Enable-RunspaceDebug " +
        "Enable-vRNIDataSource Expand-Archive Export-NsxObject Export-SpbmStoragePolicy Export-VApp Export-VDPortGroup Export-VDSwitch " +
        "Export-VMHostProfile Export-vRAIcon Export-vRAPackage Find-Command Find-DscResource Find-Module Find-NsxWhereVMUsed Find-Package " +
        "Find-PackageProvider Find-RoleCapability Find-Script Format-Hex Format-VMHostDiskPartition Format-XML Generate-VersionInfo " +
        "Get-AdvancedSetting Get-AlarmAction Get-AlarmActionTrigger Get-AlarmDefinition Get-Annotation Get-CDDrive Get-CIAccessControlRule " +
        "Get-CIDatastore Get-CINetworkAdapter Get-CIRole Get-CIUser Get-CIVApp Get-CIVAppNetwork Get-CIVAppStartRule Get-CIVAppTemplate Get-CIVM " +
        "Get-CIVMTemplate Get-CIView Get-Catalog Get-CisCommand Get-CisService Get-CloudCommand Get-Cluster Get-CompatibleVersionAddtionaPropertiesStr " +
        "Get-ComplexResourceQualifier Get-ConfigurationErrorCount Get-ContentLibraryItem Get-CustomAttribute Get-DSCResourceModules Get-Datacenter " +
        "Get-Datastore Get-DatastoreCluster Get-DrsClusterGroup Get-DrsRecommendation Get-DrsRule Get-DrsVMHostRule Get-DscResource Get-EdgeGateway " +
        "Get-EncryptedPassword Get-ErrorReport Get-EsxCli Get-EsxTop Get-ExternalNetwork Get-FileHash Get-FloppyDrive Get-Folder Get-HAPrimaryVMHost " +
        "Get-HCXAppliance Get-HCXApplianceCompute Get-HCXApplianceDVS Get-HCXApplianceDatastore Get-HCXApplianceNetwork Get-HCXContainer " +
        "Get-HCXDatastore Get-HCXGateway Get-HCXInterconnectStatus Get-HCXJob Get-HCXMigration Get-HCXNetwork Get-HCXNetworkExtension " +
        "Get-HCXReplication Get-HCXReplicationSnapshot Get-HCXService Get-HCXSite Get-HCXSitePairing Get-HCXVM Get-HardDisk Get-IScsiHbaTarget " +
        "Get-InnerMostErrorRecord Get-InstallPath Get-InstalledModule Get-InstalledScript Get-Inventory Get-ItemPropertyValue Get-KeyManagementServer " +
        "Get-KmipClientCertificate Get-KmsCluster Get-Log Get-LogType Get-MarkdownOption Get-Media Get-MofInstanceName Get-MofInstanceText Get-NetworkAdapter Get-NetworkPool " +
        "Get-NfsUser Get-NicTeamingPolicy Get-NsxApplicableMember Get-NsxApplicableSecurityAction Get-NsxBackingDVSwitch Get-NsxBackingPortGroup Get-NsxCliDfwAddrSet " +
        "Get-NsxCliDfwFilter Get-NsxCliDfwRule Get-NsxClusterStatus Get-NsxController Get-NsxDynamicCriteria Get-NsxDynamicMemberSet Get-NsxEdge Get-NsxEdgeBgp " +
        "Get-NsxEdgeBgpNeighbour Get-NsxEdgeCertificate Get-NsxEdgeCsr Get-NsxEdgeFirewall Get-NsxEdgeFirewallRule Get-NsxEdgeInterface Get-NsxEdgeInterfaceAddress " +
        "Get-NsxEdgeNat Get-NsxEdgeNatRule Get-NsxEdgeOspf Get-NsxEdgeOspfArea Get-NsxEdgeOspfInterface Get-NsxEdgePrefix Get-NsxEdgeRedistributionRule Get-NsxEdgeRouting " +
        "Get-NsxEdgeStaticRoute Get-NsxEdgeSubInterface Get-NsxFirewallExclusionListMember Get-NsxFirewallGlobalConfiguration Get-NsxFirewallPublishStatus Get-NsxFirewallRule " +
        "Get-NsxFirewallRuleMember Get-NsxFirewallSavedConfiguration Get-NsxFirewallSection Get-NsxFirewallThreshold Get-NsxIpPool Get-NsxIpSet Get-NsxLicense Get-NsxLoadBalancer " +
        "Get-NsxLoadBalancerApplicationProfile Get-NsxLoadBalancerApplicationRule Get-NsxLoadBalancerMonitor Get-NsxLoadBalancerPool Get-NsxLoadBalancerPoolMember Get-NsxLoadBalancerStats " +
        "Get-NsxLoadBalancerVip Get-NsxLogicalRouter Get-NsxLogicalRouterBgp Get-NsxLogicalRouterBgpNeighbour Get-NsxLogicalRouterBridge Get-NsxLogicalRouterBridging " +
        "Get-NsxLogicalRouterInterface Get-NsxLogicalRouterOspf Get-NsxLogicalRouterOspfArea Get-NsxLogicalRouterOspfInterface Get-NsxLogicalRouterPrefix " +
        "Get-NsxLogicalRouterRedistributionRule Get-NsxLogicalRouterRouting Get-NsxLogicalRouterStaticRoute Get-NsxLogicalSwitch Get-NsxMacSet Get-NsxManagerBackup " +
        "Get-NsxManagerCertificate Get-NsxManagerComponentSummary Get-NsxManagerNetwork Get-NsxManagerRole Get-NsxManagerSsoConfig Get-NsxManagerSyncStatus Get-NsxManagerSyslogServer " +
        "Get-NsxManagerSystemSummary Get-NsxManagerTimeSettings Get-NsxManagerVcenterConfig Get-NsxSecondaryManager Get-NsxSecurityGroup Get-NsxSecurityGroupEffectiveIpAddress " +
        "Get-NsxSecurityGroupEffectiveMacAddress Get-NsxSecurityGroupEffectiveMember Get-NsxSecurityGroupEffectiveVirtualMachine Get-NsxSecurityGroupEffectiveVnic " +
        "Get-NsxSecurityGroupMemberTypes Get-NsxSecurityPolicy Get-NsxSecurityPolicyHighestUsedPrecedence Get-NsxSecurityPolicyRule Get-NsxSecurityTag Get-NsxSecurityTagAssignment " +
        "Get-NsxSegmentIdRange Get-NsxService Get-NsxServiceDefinition Get-NsxServiceGroup Get-NsxServiceGroupMember Get-NsxServiceProfile Get-NsxSpoofguardNic Get-NsxSpoofguardPolicy " +
        "Get-NsxSslVpn Get-NsxSslVpnAuthServer Get-NsxSslVpnClientInstallationPackage Get-NsxSslVpnIpPool Get-NsxSslVpnPrivateNetwork Get-NsxSslVpnUser Get-NsxTransportZone " +
        "Get-NsxUserRole Get-NsxVdsContext Get-NsxtPolicyService Get-NsxtService Get-OSCustomizationNicMapping Get-OSCustomizationSpec Get-Org Get-OrgNetwork Get-OrgVdc " +
        "Get-OrgVdcNetwork Get-OvfConfiguration Get-PSCurrentConfigurationNode Get-PSDefaultConfigurationDocument Get-PSMetaConfigDocumentInstVersionInfo Get-PSMetaConfigurationProcessed " +
        "Get-PSReadLineKeyHandler Get-PSReadLineOption Get-PSRepository Get-PSTopConfigurationName Get-PSVersion Get-Package Get-PackageProvider Get-PackageSource Get-PassthroughDevice " +
        "Get-PositionInfo Get-PowerCLICommunity Get-PowerCLIConfiguration Get-PowerCLIHelp Get-PowerCLIVersion Get-PowerNsxVersion Get-ProviderVdc Get-PublicKeyFromFile " +
        "Get-PublicKeyFromStore Get-ResourcePool Get-Runspace Get-RunspaceDebug Get-ScsiController Get-ScsiLun Get-ScsiLunPath Get-SecurityInfo Get-SecurityPolicy Get-Snapshot " +
        "Get-SpbmCapability Get-SpbmCompatibleStorage Get-SpbmEntityConfiguration Get-SpbmFaultDomain Get-SpbmPointInTimeReplica Get-SpbmReplicationGroup Get-SpbmReplicationPair " +
        "Get-SpbmStoragePolicy Get-Stat Get-StatInterval Get-StatType Get-Tag Get-TagAssignment Get-TagCategory Get-Task Get-Template Get-TimeZone Get-Uptime Get-UsbDevice Get-VAIOFilter " +
        "Get-VApp Get-VDBlockedPolicy Get-VDPort Get-VDPortgroup Get-VDPortgroupOverridePolicy Get-VDSecurityPolicy Get-VDSwitch Get-VDSwitchPrivateVlan Get-VDTrafficShapingPolicy " +
        "Get-VDUplinkLacpPolicy Get-VDUplinkTeamingPolicy Get-VDisk Get-VIAccount Get-VICommand Get-VICredentialStoreItem Get-VIEvent Get-VIObjectByVIView Get-VIPermission Get-VIPrivilege " +
        "Get-VIProperty Get-VIRole Get-VM Get-VMGuest Get-VMHost Get-VMHostAccount Get-VMHostAdvancedConfiguration Get-VMHostAuthentication Get-VMHostAvailableTimeZone " +
        "Get-VMHostDiagnosticPartition Get-VMHostDisk Get-VMHostDiskPartition Get-VMHostFirewallDefaultPolicy Get-VMHostFirewallException Get-VMHostFirmware Get-VMHostHardware " +
        "Get-VMHostHba Get-VMHostModule Get-VMHostNetwork Get-VMHostNetworkAdapter Get-VMHostNtpServer Get-VMHostPatch Get-VMHostPciDevice Get-VMHostProfile " +
        "Get-VMHostProfileImageCacheConfiguration Get-VMHostProfileRequiredInput Get-VMHostProfileStorageDeviceConfiguration Get-VMHostProfileUserConfiguration " +
        "Get-VMHostProfileVmPortGroupConfiguration Get-VMHostRoute Get-VMHostService Get-VMHostSnmp Get-VMHostStartPolicy Get-VMHostStorage Get-VMHostSysLogServer Get-VMQuestion " +
        "Get-VMResourceConfiguration Get-VMStartPolicy Get-VTpm Get-VTpmCSR Get-VTpmCertificate Get-VasaProvider Get-VasaStorageArray Get-View Get-VirtualPortGroup Get-VirtualSwitch " +
        "Get-VmcSddcNetworkService Get-VmcService Get-VsanClusterConfiguration Get-VsanComponent Get-VsanDisk Get-VsanDiskGroup Get-VsanEvacuationPlan Get-VsanFaultDomain " +
        "Get-VsanIscsiInitiatorGroup Get-VsanIscsiInitiatorGroupTargetAssociation Get-VsanIscsiLun Get-VsanIscsiTarget Get-VsanObject Get-VsanResyncingComponent Get-VsanRuntimeInfo " +
        "Get-VsanSpaceUsage Get-VsanStat Get-VsanView Get-vRAApplianceServiceStatus Get-vRAAuthorizationRole Get-vRABlueprint Get-vRABusinessGroup Get-vRACatalogItem " +
        "Get-vRACatalogItemRequestTemplate Get-vRACatalogPrincipal Get-vRAComponentRegistryService Get-vRAComponentRegistryServiceEndpoint Get-vRAComponentRegistryServiceStatus " +
        "Get-vRAContent Get-vRAContentData Get-vRAContentType Get-vRACustomForm Get-vRAEntitledCatalogItem Get-vRAEntitledService Get-vRAEntitlement Get-vRAExternalNetworkProfile " +
        "Get-vRAGroupPrincipal Get-vRAIcon Get-vRANATNetworkProfile Get-vRANetworkProfileIPAddressList Get-vRANetworkProfileIPRangeSummary Get-vRAPackage Get-vRAPackageContent " +
        "Get-vRAPropertyDefinition Get-vRAPropertyGroup Get-vRARequest Get-vRARequestDetail Get-vRAReservation Get-vRAReservationComputeResource Get-vRAReservationComputeResourceMemory " +
        "Get-vRAReservationComputeResourceNetwork Get-vRAReservationComputeResourceResourcePool Get-vRAReservationComputeResourceStorage Get-vRAReservationPolicy " +
        "Get-vRAReservationTemplate Get-vRAReservationType Get-vRAResource Get-vRAResourceAction Get-vRAResourceActionRequestTemplate Get-vRAResourceMetric Get-vRAResourceOperation " +
        "Get-vRAResourceType Get-vRARoutedNetworkProfile Get-vRAService Get-vRAServiceBlueprint Get-vRASourceMachine Get-vRAStorageReservationPolicy Get-vRATenant Get-vRATenantDirectory " +
        "Get-vRATenantDirectoryStatus Get-vRATenantRole Get-vRAUserPrincipal Get-vRAUserPrincipalGroupMembership Get-vRAVersion Get-vRNIAPIVersion Get-vRNIApplication " +
        "Get-vRNIApplicationTier Get-vRNIDataSource Get-vRNIDataSourceSNMPConfig Get-vRNIDatastore Get-vRNIDistributedSwitch Get-vRNIDistributedSwitchPortGroup Get-vRNIEntity " +
        "Get-vRNIEntityName Get-vRNIFirewallRule Get-vRNIFlow Get-vRNIHost Get-vRNIHostVMKNic Get-vRNIIPSet Get-vRNIL2Network Get-vRNINSXManager Get-vRNINodes Get-vRNIProblem " +
        "Get-vRNIRecommendedRules Get-vRNIRecommendedRulesNsxBundle Get-vRNISecurityGroup Get-vRNISecurityTag Get-vRNIService Get-vRNIServiceGroup Get-vRNIVM Get-vRNIVMvNIC " +
        "Get-vRNIvCenter Get-vRNIvCenterCluster Get-vRNIvCenterDatacenter Get-vRNIvCenterFolder Grant-NsxSpoofguardNicApproval Import-CIVApp Import-CIVAppTemplate Import-NsxObject " +
        "Import-PackageProvider Import-PowerShellDataFile Import-SpbmStoragePolicy Import-VApp Import-VMHostProfile Import-vRAContentData Import-vRAIcon Import-vRAPackage " +
        "Initialize-ConfigurationRuntimeState Install-Module Install-NsxCluster Install-Package Install-PackageProvider Install-Script Install-VMHostPatch Invoke-DrsRecommendation " +
        "Invoke-NsxCli Invoke-NsxClusterResolveAll Invoke-NsxManagerSync Invoke-NsxRestMethod Invoke-NsxWebRequest Invoke-VMHostProfile Invoke-VMScript Invoke-XpathQuery " +
        "Invoke-vRADataCollection Invoke-vRARestMethod Invoke-vRATenantDirectorySync Invoke-vRNIRestMethod Join-String Mount-Tools Move-Cluster Move-Datacenter Move-Datastore Move-Folder " +
        "Move-HardDisk Move-Inventory Move-NsxSecurityPolicyRule Move-ResourcePool Move-Template Move-VApp Move-VDisk Move-VM Move-VMHost New-AdvancedSetting New-AlarmAction " +
        "New-AlarmActionTrigger New-CDDrive New-CIAccessControlRule New-CIVApp New-CIVAppNetwork New-CIVAppTemplate New-CIVM New-Cluster New-CustomAttribute New-Datacenter New-Datastore " +
        "New-DatastoreCluster New-DatastoreDrive New-DrsClusterGroup New-DrsRule New-DrsVMHostRule New-DscChecksum New-FloppyDrive New-Folder New-Guid New-HCXAppliance New-HCXMigration " +
        "New-HCXNetworkExtension New-HCXNetworkMapping New-HCXReplication New-HCXSitePairing New-HCXStaticRoute New-HardDisk New-IScsiHbaTarget New-KmipClientCertificate " +
        "New-NetworkAdapter New-NfsUser New-NsxAddressSpec New-NsxClusterVxlanConfig New-NsxController New-NsxDynamicCriteriaSpec New-NsxEdge New-NsxEdgeBgpNeighbour New-NsxEdgeCsr " +
        "New-NsxEdgeFirewallRule New-NsxEdgeInterfaceSpec New-NsxEdgeNatRule New-NsxEdgeOspfArea New-NsxEdgeOspfInterface New-NsxEdgePrefix New-NsxEdgeRedistributionRule " +
        "New-NsxEdgeSelfSignedCertificate New-NsxEdgeStaticRoute New-NsxEdgeSubInterface New-NsxEdgeSubInterfaceSpec New-NsxFirewallRule New-NsxFirewallSavedConfiguration " +
        "New-NsxFirewallSection New-NsxIpPool New-NsxIpSet New-NsxLoadBalancerApplicationProfile New-NsxLoadBalancerApplicationRule New-NsxLoadBalancerMemberSpec " +
        "New-NsxLoadBalancerMonitor New-NsxLoadBalancerPool New-NsxLogicalRouter New-NsxLogicalRouterBgpNeighbour New-NsxLogicalRouterBridge New-NsxLogicalRouterInterface " +
        "New-NsxLogicalRouterInterfaceSpec New-NsxLogicalRouterOspfArea New-NsxLogicalRouterOspfInterface New-NsxLogicalRouterPrefix New-NsxLogicalRouterRedistributionRule " +
        "New-NsxLogicalRouterStaticRoute New-NsxLogicalSwitch New-NsxMacSet New-NsxManager New-NsxSecurityGroup New-NsxSecurityPolicy New-NsxSecurityPolicyAssignment " +
        "New-NsxSecurityPolicyFirewallRuleSpec New-NsxSecurityPolicyGuestIntrospectionSpec New-NsxSecurityPolicyNetworkIntrospectionSpec New-NsxSecurityTag New-NsxSecurityTagAssignment " +
        "New-NsxSegmentIdRange New-NsxService New-NsxServiceGroup New-NsxSpoofguardPolicy New-NsxSslVpnAuthServer New-NsxSslVpnClientInstallationPackage New-NsxSslVpnIpPool " +
        "New-NsxSslVpnPrivateNetwork New-NsxSslVpnUser New-NsxTransportZone New-NsxVdsContext New-OSCustomizationNicMapping New-OSCustomizationSpec New-Org New-OrgNetwork New-OrgVdc " +
        "New-OrgVdcNetwork New-ResourcePool New-ScriptFileInfo New-ScsiController New-Snapshot New-SpbmRule New-SpbmRuleSet New-SpbmStoragePolicy New-StatInterval New-Tag " +
        "New-TagAssignment New-TagCategory New-Template New-TemporaryFile New-VAIOFilter New-VApp New-VDPortgroup New-VDSwitch New-VDSwitchPrivateVlan New-VDisk " +
        "New-VICredentialStoreItem New-VIInventoryDrive New-VIPermission New-VIProperty New-VIRole New-VISamlSecurityContext New-VM New-VMHostAccount New-VMHostNetworkAdapter " +
        "New-VMHostProfile New-VMHostProfileVmPortGroupConfiguration New-VMHostRoute New-VTpm New-VasaProvider New-VcsOAuthSecurityContext New-VirtualPortGroup New-VirtualSwitch " +
        "New-VsanDisk New-VsanDiskGroup New-VsanFaultDomain New-VsanIscsiInitiatorGroup New-VsanIscsiInitiatorGroupTargetAssociation New-VsanIscsiLun New-VsanIscsiTarget " +
        "New-vRABusinessGroup New-vRAEntitlement New-vRAExternalNetworkProfile New-vRAGroupPrincipal New-vRANATNetworkProfile New-vRANetworkProfileIPRangeDefinition New-vRAPackage " +
        "New-vRAPropertyDefinition New-vRAPropertyGroup New-vRAReservation New-vRAReservationNetworkDefinition New-vRAReservationPolicy New-vRAReservationStorageDefinition " +
        "New-vRARoutedNetworkProfile New-vRAService New-vRAStorageReservationPolicy New-vRATenant New-vRATenantDirectory New-vRAUserPrincipal New-vRNIApplication New-vRNIApplicationTier " +
        "New-vRNIDataSource Open-VMConsoleWindow Publish-Module Publish-NsxSpoofguardPolicy Publish-Script Register-PSRepository Register-PackageSource Remove-AdvancedSetting " +
        "Remove-AlarmAction Remove-AlarmActionTrigger Remove-Alias Remove-CDDrive Remove-CIAccessControlRule Remove-CIVApp Remove-CIVAppNetwork Remove-CIVAppTemplate Remove-Cluster " +
        "Remove-CustomAttribute Remove-Datacenter Remove-Datastore Remove-DatastoreCluster Remove-DrsClusterGroup Remove-DrsRule Remove-DrsVMHostRule Remove-FloppyDrive Remove-Folder " +
        "Remove-HCXAppliance Remove-HCXNetworkExtension Remove-HCXReplication Remove-HCXSitePairing Remove-HardDisk Remove-IScsiHbaTarget Remove-Inventory Remove-KeyManagementServer " +
        "Remove-NetworkAdapter Remove-NfsUser Remove-NsxCluster Remove-NsxClusterVxlanConfig Remove-NsxController Remove-NsxDynamicCriteria Remove-NsxDynamicMemberSet Remove-NsxEdge " +
        "Remove-NsxEdgeBgpNeighbour Remove-NsxEdgeCertificate Remove-NsxEdgeCsr Remove-NsxEdgeFirewallRule Remove-NsxEdgeInterfaceAddress Remove-NsxEdgeNatRule Remove-NsxEdgeOspfArea " +
        "Remove-NsxEdgeOspfInterface Remove-NsxEdgePrefix Remove-NsxEdgeRedistributionRule Remove-NsxEdgeStaticRoute Remove-NsxEdgeSubInterface Remove-NsxFirewallExclusionListMember " +
        "Remove-NsxFirewallRule Remove-NsxFirewallRuleMember Remove-NsxFirewallSavedConfiguration Remove-NsxFirewallSection Remove-NsxIpPool Remove-NsxIpSet Remove-NsxIpSetMember " +
        "Remove-NsxLoadBalancerApplicationProfile Remove-NsxLoadBalancerMonitor Remove-NsxLoadBalancerPool Remove-NsxLoadBalancerPoolMember Remove-NsxLoadBalancerVip " +
        "Remove-NsxLogicalRouter Remove-NsxLogicalRouterBgpNeighbour Remove-NsxLogicalRouterBridge Remove-NsxLogicalRouterInterface Remove-NsxLogicalRouterOspfArea " +
        "Remove-NsxLogicalRouterOspfInterface Remove-NsxLogicalRouterPrefix Remove-NsxLogicalRouterRedistributionRule Remove-NsxLogicalRouterStaticRoute Remove-NsxLogicalSwitch " +
        "Remove-NsxMacSet Remove-NsxSecondaryManager Remove-NsxSecurityGroup Remove-NsxSecurityGroupMember Remove-NsxSecurityPolicy Remove-NsxSecurityPolicyAssignment " +
        "Remove-NsxSecurityPolicyRule Remove-NsxSecurityPolicyRuleGroup Remove-NsxSecurityPolicyRuleService Remove-NsxSecurityTag Remove-NsxSecurityTagAssignment " +
        "Remove-NsxSegmentIdRange Remove-NsxService Remove-NsxServiceGroup Remove-NsxSpoofguardPolicy Remove-NsxSslVpnClientInstallationPackage Remove-NsxSslVpnIpPool " +
        "Remove-NsxSslVpnPrivateNetwork Remove-NsxSslVpnUser Remove-NsxTransportZone Remove-NsxTransportZoneMember Remove-NsxVdsContext Remove-OSCustomizationNicMapping " +
        "Remove-OSCustomizationSpec Remove-Org Remove-OrgNetwork Remove-OrgVdc Remove-OrgVdcNetwork Remove-PSReadLineKeyHandler Remove-PassthroughDevice Remove-ResourcePool " +
        "Remove-Snapshot Remove-SpbmStoragePolicy Remove-StatInterval Remove-Tag Remove-TagAssignment Remove-TagCategory Remove-Template Remove-UsbDevice Remove-VAIOFilter Remove-VApp " +
        "Remove-VDPortGroup Remove-VDSwitch Remove-VDSwitchPhysicalNetworkAdapter Remove-VDSwitchPrivateVlan Remove-VDSwitchVMHost Remove-VDisk Remove-VICredentialStoreItem " +
        "Remove-VIPermission Remove-VIProperty Remove-VIRole Remove-VM Remove-VMHost Remove-VMHostAccount Remove-VMHostNetworkAdapter Remove-VMHostNtpServer Remove-VMHostProfile " +
        "Remove-VMHostProfileVmPortGroupConfiguration Remove-VMHostRoute Remove-VTpm Remove-VasaProvider Remove-VirtualPortGroup Remove-VirtualSwitch " +
        "Remove-VirtualSwitchPhysicalNetworkAdapter Remove-VsanDisk Remove-VsanDiskGroup Remove-VsanFaultDomain Remove-VsanIscsiInitiatorGroup " +
        "Remove-VsanIscsiInitiatorGroupTargetAssociation Remove-VsanIscsiLun Remove-VsanIscsiTarget Remove-vRABusinessGroup Remove-vRACustomForm Remove-vRAExternalNetworkProfile " +
        "Remove-vRAGroupPrincipal Remove-vRAIcon Remove-vRANATNetworkProfile Remove-vRAPackage Remove-vRAPrincipalFromTenantRole Remove-vRAPropertyDefinition Remove-vRAPropertyGroup " +
        "Remove-vRAReservation Remove-vRAReservationNetwork Remove-vRAReservationPolicy Remove-vRAReservationStorage Remove-vRARoutedNetworkProfile Remove-vRAService " +
        "Remove-vRAStorageReservationPolicy Remove-vRATenant Remove-vRATenantDirectory Remove-vRAUserPrincipal Remove-vRNIApplication Remove-vRNIApplicationTier Remove-vRNIDataSource " +
        "Repair-NsxEdge Repair-VsanObject Request-vRACatalogItem Request-vRAResourceAction Restart-CIVApp Restart-CIVAppGuest Restart-CIVM Restart-CIVMGuest Restart-VM Restart-VMGuest " +
        "Restart-VMHost Restart-VMHostService Resume-HCXReplication Revoke-NsxSpoofguardNicApproval Save-Module Save-Package Save-Script Search-Cloud Set-AdvancedSetting " +
        "Set-AlarmDefinition Set-Annotation Set-CDDrive Set-CIAccessControlRule Set-CINetworkAdapter Set-CIVApp Set-CIVAppNetwork Set-CIVAppStartRule Set-CIVAppTemplate Set-Cluster " +
        "Set-CustomAttribute Set-Datacenter Set-Datastore Set-DatastoreCluster Set-DrsClusterGroup Set-DrsRule Set-DrsVMHostRule Set-FloppyDrive Set-Folder Set-HCXAppliance " +
        "Set-HCXMigration Set-HCXReplication Set-HardDisk Set-IScsiHbaTarget Set-KeyManagementServer Set-KmsCluster Set-MarkdownOption Set-NetworkAdapter Set-NfsUser Set-NicTeamingPolicy " +
        "Set-NodeExclusiveResources Set-NodeManager Set-NodeResourceSource Set-NodeResources Set-NsxEdge Set-NsxEdgeBgp Set-NsxEdgeFirewall Set-NsxEdgeInterface Set-NsxEdgeNat " +
        "Set-NsxEdgeOspf Set-NsxEdgeRouting Set-NsxFirewallGlobalConfiguration Set-NsxFirewallRule Set-NsxFirewallSavedConfiguration Set-NsxFirewallThreshold Set-NsxLoadBalancer " +
        "Set-NsxLoadBalancerPoolMember Set-NsxLogicalRouter Set-NsxLogicalRouterBgp Set-NsxLogicalRouterBridging Set-NsxLogicalRouterInterface Set-NsxLogicalRouterOspf " +
        "Set-NsxLogicalRouterRouting Set-NsxManager Set-NsxManagerRole Set-NsxManagerTimeSettings Set-NsxSecurityPolicy Set-NsxSecurityPolicyFirewallRule Set-NsxSslVpn " +
        "Set-OSCustomizationNicMapping Set-OSCustomizationSpec Set-Org Set-OrgNetwork Set-OrgVdc Set-OrgVdcNetwork Set-PSCurrentConfigurationNode Set-PSDefaultConfigurationDocument " +
        "Set-PSMetaConfigDocInsProcessedBeforeMeta Set-PSMetaConfigVersionInfoV2 Set-PSReadLineKeyHandler Set-PSReadLineOption Set-PSRepository Set-PSTopConfigurationName " +
        "Set-PackageSource Set-PowerCLIConfiguration Set-ResourcePool Set-ScsiController Set-ScsiLun Set-ScsiLunPath Set-SecurityPolicy Set-Snapshot Set-SpbmEntityConfiguration " +
        "Set-SpbmStoragePolicy Set-StatInterval Set-Tag Set-TagCategory Set-Template Set-VAIOFilter Set-VApp Set-VDBlockedPolicy Set-VDPort Set-VDPortgroup Set-VDPortgroupOverridePolicy " +
        "Set-VDSecurityPolicy Set-VDSwitch Set-VDTrafficShapingPolicy Set-VDUplinkLacpPolicy Set-VDUplinkTeamingPolicy Set-VDVlanConfiguration Set-VDisk Set-VIPermission Set-VIRole Set-VM " +
        "Set-VMHost Set-VMHostAccount Set-VMHostAdvancedConfiguration Set-VMHostAuthentication Set-VMHostDiagnosticPartition Set-VMHostFirewallDefaultPolicy Set-VMHostFirewallException " +
        "Set-VMHostFirmware Set-VMHostHba Set-VMHostModule Set-VMHostNetwork Set-VMHostNetworkAdapter Set-VMHostProfile Set-VMHostProfileImageCacheConfiguration " +
        "Set-VMHostProfileStorageDeviceConfiguration Set-VMHostProfileUserConfiguration Set-VMHostProfileVmPortGroupConfiguration Set-VMHostRoute Set-VMHostService Set-VMHostSnmp " +
        "Set-VMHostStartPolicy Set-VMHostStorage Set-VMHostSysLogServer Set-VMQuestion Set-VMResourceConfiguration Set-VMStartPolicy Set-VTpm Set-VirtualPortGroup Set-VirtualSwitch " +
        "Set-VsanClusterConfiguration Set-VsanFaultDomain Set-VsanIscsiInitiatorGroup Set-VsanIscsiLun Set-VsanIscsiTarget Set-vRABusinessGroup Set-vRACatalogItem Set-vRACustomForm " +
        "Set-vRAEntitlement Set-vRAExternalNetworkProfile Set-vRANATNetworkProfile Set-vRAReservation Set-vRAReservationNetwork Set-vRAReservationPolicy Set-vRAReservationStorage " +
        "Set-vRARoutedNetworkProfile Set-vRAService Set-vRAStorageReservationPolicy Set-vRATenant Set-vRATenantDirectory Set-vRAUserPrincipal Set-vRNIDataSourceSNMPConfig Show-Markdown " +
        "Start-CIVApp Start-CIVM Start-HCXMigration Start-HCXReplication Start-SpbmReplicationFailover Start-SpbmReplicationPrepareFailover Start-SpbmReplicationPromote " +
        "Start-SpbmReplicationReverse Start-SpbmReplicationTestFailover Start-ThreadJob Start-VApp Start-VM Start-VMHost Start-VMHostService Start-VsanClusterDiskUpdate " +
        "Start-VsanClusterRebalance Start-VsanEncryptionConfiguration Stop-CIVApp Stop-CIVAppGuest Stop-CIVM Stop-CIVMGuest Stop-SpbmReplicationTestFailover Stop-Task Stop-VApp Stop-VM " +
        "Stop-VMGuest Stop-VMHost Stop-VMHostService Stop-VsanClusterRebalance Suspend-CIVApp Suspend-CIVM Suspend-HCXReplication Suspend-VM Suspend-VMGuest Suspend-VMHost " +
        "Sync-SpbmReplicationGroup Test-ConflictingResources Test-HCXMigration Test-HCXReplication Test-Json Test-ModuleReloadRequired Test-MofInstanceText Test-NodeManager " +
        "Test-NodeResourceSource Test-NodeResources Test-ScriptFileInfo Test-VMHostProfileCompliance Test-VMHostSnmp Test-VsanClusterHealth Test-VsanNetworkPerformance " +
        "Test-VsanStoragePerformance Test-VsanVMCreation Test-vRAPackage Uninstall-Module Uninstall-Package Uninstall-Script Unlock-VM Unregister-PSRepository Unregister-PackageSource " +
        "Update-ConfigurationDocumentRef Update-ConfigurationErrorCount Update-DependsOn Update-LocalConfigManager Update-Module Update-ModuleManifest Update-ModuleVersion Update-PowerNsx " +
        "Update-Script Update-ScriptFileInfo Update-Tools Update-VsanHclDatabase ValidateUpdate-ConfigurationData Wait-Debugger Wait-NsxControllerJob Wait-NsxGenericJob Wait-NsxJob " +
        "Wait-Task Wait-Tools Write-Information Write-Log Write-MetaConfigFile Write-NodeMOFFile",
      nomarkup:
        "-ne -eq -lt -gt -ge -le -not -like -notlike -match -notmatch -contains -notcontains -in -notin -replace",
    },
    contains: [
      BACKTICK_ESCAPE,
      hljs.NUMBER_MODE,
      QUOTE_STRING,
      APOS_STRING,
      LITERAL,
      VAR,
      PS_COMMENT,
    ],
  };
};

/***/ }),

/***/ "./node_modules/highlight.js/lib/languages/sql.js":
/*!********************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/sql.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(hljs) {
  var COMMENT_MODE = hljs.COMMENT('--', '$');
  return {
    case_insensitive: true,
    illegal: /[<>{}*]/,
    contains: [
      {
        beginKeywords:
          'begin end start commit rollback savepoint lock alter create drop rename call ' +
          'delete do handler insert load replace select truncate update set show pragma grant ' +
          'merge describe use explain help declare prepare execute deallocate release ' +
          'unlock purge reset change stop analyze cache flush optimize repair kill ' +
          'install uninstall checksum restore check backup revoke comment values with',
        end: /;/, endsWithParent: true,
        lexemes: /[\w\.]+/,
        keywords: {
          keyword:
            'as abort abs absolute acc acce accep accept access accessed accessible account acos action activate add ' +
            'addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias ' +
            'all allocate allow alter always analyze ancillary and anti any anydata anydataset anyschema anytype apply ' +
            'archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan ' +
            'atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid ' +
            'authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile ' +
            'before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float ' +
            'binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound ' +
            'bucket buffer_cache buffer_pool build bulk by byte byteordermark bytes cache caching call calling cancel ' +
            'capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base ' +
            'char_length character_length characters characterset charindex charset charsetform charsetid check ' +
            'checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close ' +
            'cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation ' +
            'collect colu colum column column_value columns columns_updated comment commit compact compatibility ' +
            'compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn ' +
            'connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection ' +
            'consider consistent constant constraint constraints constructor container content contents context ' +
            'contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost ' +
            'count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation ' +
            'critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user ' +
            'cursor curtime customdatum cycle data database databases datafile datafiles datalength date_add ' +
            'date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts ' +
            'day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate ' +
            'declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults ' +
            'deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank ' +
            'depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor ' +
            'deterministic diagnostics difference dimension direct_load directory disable disable_all ' +
            'disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div ' +
            'do document domain dotnet double downgrade drop dumpfile duplicate duration each edition editionable ' +
            'editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt ' +
            'end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors ' +
            'escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding ' +
            'execu execut execute exempt exists exit exp expire explain explode export export_set extended extent external ' +
            'external_1 external_2 externally extract failed failed_login_attempts failover failure far fast ' +
            'feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final ' +
            'finish first first_value fixed flash_cache flashback floor flush following follows for forall force foreign ' +
            'form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ' +
            'ftp full function general generated get get_format get_lock getdate getutcdate global global_name ' +
            'globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups ' +
            'gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex ' +
            'hierarchy high high_priority hosts hour hours http id ident_current ident_incr ident_seed identified ' +
            'identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment ' +
            'index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile ' +
            'initial initialized initially initrans inmemory inner innodb input insert install instance instantiable ' +
            'instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat ' +
            'is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists ' +
            'keep keep_duplicates key keys kill language large last last_day last_insert_id last_value lateral lax lcase ' +
            'lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit ' +
            'lines link list listagg little ln load load_file lob lobs local localtime localtimestamp locate ' +
            'locator lock locked log log10 log2 logfile logfiles logging logical logical_reads_per_call ' +
            'logoff logon logs long loop low low_priority lower lpad lrtrim ltrim main make_set makedate maketime ' +
            'managed management manual map mapping mask master master_pos_wait match matched materialized max ' +
            'maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans ' +
            'md5 measures median medium member memcompress memory merge microsecond mid migration min minextents ' +
            'minimum mining minus minute minutes minvalue missing mod mode model modification modify module monitoring month ' +
            'months mount move movement multiset mutex name name_const names nan national native natural nav nchar ' +
            'nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile ' +
            'nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile ' +
            'nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder ' +
            'nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck ' +
            'noswitch not nothing notice notnull notrim novalidate now nowait nth_value nullif nulls num numb numbe ' +
            'nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ' +
            'ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old ' +
            'on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date ' +
            'oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary ' +
            'out outer outfile outline output over overflow overriding package pad parallel parallel_enable ' +
            'parameters parent parse partial partition partitions pascal passing password password_grace_time ' +
            'password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex ' +
            'pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc ' +
            'performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin ' +
            'policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction ' +
            'prediction_cost prediction_details prediction_probability prediction_set prepare present preserve ' +
            'prior priority private private_sga privileges procedural procedure procedure_analyze processlist ' +
            'profiles project prompt protection public publishingservername purge quarter query quick quiesce quota ' +
            'quotename radians raise rand range rank raw read reads readsize rebuild record records ' +
            'recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh ' +
            'regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy ' +
            'reject rekey relational relative relaylog release release_lock relies_on relocate rely rem remainder rename ' +
            'repair repeat replace replicate replication required reset resetlogs resize resource respect restore ' +
            'restricted result result_cache resumable resume retention return returning returns reuse reverse revoke ' +
            'right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows ' +
            'rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll ' +
            'sdo_georaster sdo_topo_geometry search sec_to_time second seconds section securefile security seed segment select ' +
            'self semi sequence sequential serializable server servererror session session_user sessions_per_user set ' +
            'sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor ' +
            'si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin ' +
            'size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex ' +
            'source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows ' +
            'sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone ' +
            'standby start starting startup statement static statistics stats_binomial_test stats_crosstab ' +
            'stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep ' +
            'stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev ' +
            'stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate ' +
            'subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum ' +
            'suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate ' +
            'sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime table tables tablespace tablesample tan tdo ' +
            'template temporary terminated tertiary_weights test than then thread through tier ties time time_format ' +
            'time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr ' +
            'timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking ' +
            'transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate ' +
            'try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress ' +
            'under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unnest unpivot ' +
            'unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert ' +
            'url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date ' +
            'utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var ' +
            'var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray ' +
            'verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear ' +
            'wellformed when whene whenev wheneve whenever where while whitespace window with within without work wrapped ' +
            'xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces ' +
            'xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek',
          literal:
            'true false null unknown',
          built_in:
            'array bigint binary bit blob bool boolean char character date dec decimal float int int8 integer interval number ' +
            'numeric real record serial serial8 smallint text time timestamp tinyint varchar varying void'
        },
        contains: [
          {
            className: 'string',
            begin: '\'', end: '\'',
            contains: [hljs.BACKSLASH_ESCAPE, {begin: '\'\''}]
          },
          {
            className: 'string',
            begin: '"', end: '"',
            contains: [hljs.BACKSLASH_ESCAPE, {begin: '""'}]
          },
          {
            className: 'string',
            begin: '`', end: '`',
            contains: [hljs.BACKSLASH_ESCAPE]
          },
          hljs.C_NUMBER_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          COMMENT_MODE,
          hljs.HASH_COMMENT_MODE
        ]
      },
      hljs.C_BLOCK_COMMENT_MODE,
      COMMENT_MODE,
      hljs.HASH_COMMENT_MODE
    ]
  };
};

/***/ }),

/***/ "./node_modules/highlight.js/lib/languages/typescript.js":
/*!***************************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/typescript.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(hljs) {
  var JS_IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
  var KEYWORDS = {
    keyword:
      'in if for while finally var new function do return void else break catch ' +
      'instanceof with throw case default try this switch continue typeof delete ' +
      'let yield const class public private protected get set super ' +
      'static implements enum export import declare type namespace abstract ' +
      'as from extends async await',
    literal:
      'true false null undefined NaN Infinity',
    built_in:
      'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
      'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
      'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
      'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
      'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
      'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' +
      'module console window document any number boolean string void Promise'
  };

  var DECORATOR = {
    className: 'meta',
    begin: '@' + JS_IDENT_RE,
  };

  var ARGS =
  {
    begin: '\\(',
    end: /\)/,
    keywords: KEYWORDS,
    contains: [
      'self',
      hljs.QUOTE_STRING_MODE,
      hljs.APOS_STRING_MODE,
      hljs.NUMBER_MODE
    ]
  };

  var PARAMS = {
    className: 'params',
    begin: /\(/, end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: KEYWORDS,
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      DECORATOR,
      ARGS
    ]
  };
  var NUMBER = {
    className: 'number',
    variants: [
      { begin: '\\b(0[bB][01]+)' },
      { begin: '\\b(0[oO][0-7]+)' },
      { begin: hljs.C_NUMBER_RE }
    ],
    relevance: 0
  };
  var SUBST = {
    className: 'subst',
    begin: '\\$\\{', end: '\\}',
    keywords: KEYWORDS,
    contains: []  // defined later
  };
  var HTML_TEMPLATE = {
    begin: 'html`', end: '',
    starts: {
      end: '`', returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: 'xml',
    }
  };
  var CSS_TEMPLATE = {
    begin: 'css`', end: '',
    starts: {
      end: '`', returnEnd: false,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      subLanguage: 'css',
    }
  };
  var TEMPLATE_STRING = {
    className: 'string',
    begin: '`', end: '`',
    contains: [
      hljs.BACKSLASH_ESCAPE,
      SUBST
    ]
  };
  SUBST.contains = [
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE,
    HTML_TEMPLATE,
    CSS_TEMPLATE,
    TEMPLATE_STRING,
    NUMBER,
    hljs.REGEXP_MODE
  ];



  return {
    aliases: ['ts'],
    keywords: KEYWORDS,
    contains: [
      {
        className: 'meta',
        begin: /^\s*['"]use strict['"]/
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      TEMPLATE_STRING,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      NUMBER,
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.REGEXP_MODE,
          {
            className: 'function',
            begin: '(\\(.*?\\)|' + hljs.IDENT_RE + ')\\s*=>', returnBegin: true,
            end: '\\s*=>',
            contains: [
              {
                className: 'params',
                variants: [
                  {
                    begin: hljs.IDENT_RE
                  },
                  {
                    begin: /\(\s*\)/,
                  },
                  {
                    begin: /\(/, end: /\)/,
                    excludeBegin: true, excludeEnd: true,
                    keywords: KEYWORDS,
                    contains: [
                      'self',
                      hljs.C_LINE_COMMENT_MODE,
                      hljs.C_BLOCK_COMMENT_MODE
                    ]
                  }
                ]
              }
            ]
          }
        ],
        relevance: 0
      },
      {
        className: 'function',
        begin: 'function', end: /[\{;]/, excludeEnd: true,
        keywords: KEYWORDS,
        contains: [
          'self',
          hljs.inherit(hljs.TITLE_MODE, { begin: JS_IDENT_RE }),
          PARAMS
        ],
        illegal: /%/,
        relevance: 0 // () => {} is more typical in TypeScript
      },
      {
        beginKeywords: 'constructor', end: /\{/, excludeEnd: true,
        contains: [
          'self',
          PARAMS
        ]
      },
      { // prevent references like module.id from being higlighted as module definitions
        begin: /module\./,
        keywords: { built_in: 'module' },
        relevance: 0
      },
      {
        beginKeywords: 'module', end: /\{/, excludeEnd: true
      },
      {
        beginKeywords: 'interface', end: /\{/, excludeEnd: true,
        keywords: 'interface extends'
      },
      {
        begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      },
      {
        begin: '\\.' + hljs.IDENT_RE, relevance: 0 // hack: prevents detection of keywords after dots
      },
      DECORATOR,
      ARGS
    ]
  };
};

/***/ }),

/***/ "./node_modules/highlight.js/lib/languages/xml.js":
/*!********************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/xml.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(hljs) {
  var XML_IDENT_RE = '[A-Za-z0-9\\._:-]+';
  var TAG_INTERNALS = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: 'attr',
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: 'string',
            endsParent: true,
            variants: [
              {begin: /"/, end: /"/},
              {begin: /'/, end: /'/},
              {begin: /[^\s"'=<>`]+/}
            ]
          }
        ]
      }
    ]
  };
  return {
    aliases: ['html', 'xhtml', 'rss', 'atom', 'xjb', 'xsd', 'xsl', 'plist', 'wsf'],
    case_insensitive: true,
    contains: [
      {
        className: 'meta',
        begin: '<!DOCTYPE', end: '>',
        relevance: 10,
        contains: [{begin: '\\[', end: '\\]'}]
      },
      hljs.COMMENT(
        '<!--',
        '-->',
        {
          relevance: 10
        }
      ),
      {
        begin: '<\\!\\[CDATA\\[', end: '\\]\\]>',
        relevance: 10
      },
      {
        className: 'meta',
        begin: /<\?xml/, end: /\?>/, relevance: 10
      },
      {
        begin: /<\?(php)?/, end: /\?>/,
        subLanguage: 'php',
        contains: [
          // We don't want the php closing tag ?> to close the PHP block when
          // inside any of the following blocks:
          {begin: '/\\*', end: '\\*/', skip: true},
          {begin: 'b"', end: '"', skip: true},
          {begin: 'b\'', end: '\'', skip: true},
          hljs.inherit(hljs.APOS_STRING_MODE, {illegal: null, className: null, contains: null, skip: true}),
          hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null, className: null, contains: null, skip: true})
        ]
      },
      {
        className: 'tag',
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending braket. The '$' is needed for the lexeme to be recognized
        by hljs.subMode() that tests lexemes outside the stream.
        */
        begin: '<style(?=\\s|>|$)', end: '>',
        keywords: {name: 'style'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '</style>', returnEnd: true,
          subLanguage: ['css', 'xml']
        }
      },
      {
        className: 'tag',
        // See the comment in the <style tag about the lookahead pattern
        begin: '<script(?=\\s|>|$)', end: '>',
        keywords: {name: 'script'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '\<\/script\>', returnEnd: true,
          subLanguage: ['actionscript', 'javascript', 'handlebars', 'xml', 'vbscript']
        }
      },
      {
        className: 'tag',
        begin: '</?', end: '/?>',
        contains: [
          {
            className: 'name', begin: /[^\/><\s]+/, relevance: 0
          },
          TAG_INTERNALS
        ]
      }
    ]
  };
};

/***/ }),

/***/ "./wwwroot/js/components/highlighter/highlighting.ts":
/*!***********************************************************!*\
  !*** ./wwwroot/js/components/highlighter/highlighting.ts ***!
  \***********************************************************/
/*! exports provided: highlightElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "highlightElement", function() { return highlightElement; });
/* harmony import */ var highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! highlight.js/lib/highlight */ "./node_modules/highlight.js/lib/highlight.js");
/* harmony import */ var highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var highlight_js_lib_languages_cs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! highlight.js/lib/languages/cs */ "./node_modules/highlight.js/lib/languages/cs.js");
/* harmony import */ var highlight_js_lib_languages_cs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_languages_cs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var highlight_js_lib_languages_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! highlight.js/lib/languages/css */ "./node_modules/highlight.js/lib/languages/css.js");
/* harmony import */ var highlight_js_lib_languages_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_languages_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var highlight_js_lib_languages_javascript__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! highlight.js/lib/languages/javascript */ "./node_modules/highlight.js/lib/languages/javascript.js");
/* harmony import */ var highlight_js_lib_languages_javascript__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_languages_javascript__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var highlight_js_lib_languages_plaintext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! highlight.js/lib/languages/plaintext */ "./node_modules/highlight.js/lib/languages/plaintext.js");
/* harmony import */ var highlight_js_lib_languages_plaintext__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_languages_plaintext__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var highlight_js_lib_languages_powershell__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! highlight.js/lib/languages/powershell */ "./node_modules/highlight.js/lib/languages/powershell.js");
/* harmony import */ var highlight_js_lib_languages_powershell__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_languages_powershell__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var highlight_js_lib_languages_sql__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! highlight.js/lib/languages/sql */ "./node_modules/highlight.js/lib/languages/sql.js");
/* harmony import */ var highlight_js_lib_languages_sql__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_languages_sql__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var highlight_js_lib_languages_typescript__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! highlight.js/lib/languages/typescript */ "./node_modules/highlight.js/lib/languages/typescript.js");
/* harmony import */ var highlight_js_lib_languages_typescript__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_languages_typescript__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! highlight.js/lib/languages/xml */ "./node_modules/highlight.js/lib/languages/xml.js");
/* harmony import */ var highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_8__);









highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0___default.a.registerLanguage('cs', highlight_js_lib_languages_cs__WEBPACK_IMPORTED_MODULE_1___default.a);
highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0___default.a.registerLanguage('css', highlight_js_lib_languages_css__WEBPACK_IMPORTED_MODULE_2___default.a);
highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0___default.a.registerLanguage('js', highlight_js_lib_languages_javascript__WEBPACK_IMPORTED_MODULE_3___default.a);
highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0___default.a.registerLanguage('plain', highlight_js_lib_languages_plaintext__WEBPACK_IMPORTED_MODULE_4___default.a);
highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0___default.a.registerLanguage('ps', highlight_js_lib_languages_powershell__WEBPACK_IMPORTED_MODULE_5___default.a);
highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0___default.a.registerLanguage('sql', highlight_js_lib_languages_sql__WEBPACK_IMPORTED_MODULE_6___default.a);
highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0___default.a.registerLanguage('ts', highlight_js_lib_languages_typescript__WEBPACK_IMPORTED_MODULE_7___default.a);
highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0___default.a.registerLanguage('xml', highlight_js_lib_languages_xml__WEBPACK_IMPORTED_MODULE_8___default.a);
var supportedLanguages = highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0___default.a.listLanguages();
function highlightElement(i, el) {
    var code = $(el);
    code.addClass('hljs');
    if (code.is('[class^=language]')) {
        el.innerHTML = highlight_js_lib_highlight__WEBPACK_IMPORTED_MODULE_0___default.a.highlightAuto(el.innerText, supportedLanguages).value;
    }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "jquery")))

/***/ }),

/***/ "./wwwroot/js/components/highlighter/index.ts":
/*!****************************************************!*\
  !*** ./wwwroot/js/components/highlighter/index.ts ***!
  \****************************************************/
/*! exports provided: highlightElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _highlighting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./highlighting */ "./wwwroot/js/components/highlighter/highlighting.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "highlightElement", function() { return _highlighting__WEBPACK_IMPORTED_MODULE_0__["highlightElement"]; });




/***/ }),

/***/ "./wwwroot/js/read.ts":
/*!****************************!*\
  !*** ./wwwroot/js/read.ts ***!
  \****************************/
/*! exports provided: moveDocumentButton, moveDocumentModal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function($) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "moveDocumentButton", function() { return moveDocumentButton; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "moveDocumentModal", function() { return moveDocumentModal; });
/* harmony import */ var _components_highlighter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/highlighter */ "./wwwroot/js/components/highlighter/index.ts");

$('pre code').each(_components_highlighter__WEBPACK_IMPORTED_MODULE_0__["highlightElement"]);
var moveDocumentButton = $('#move-document-button');
var moveDocumentModal = $('#move-document-modal');
moveDocumentModal.modal({ show: false });
moveDocumentButton.on('click', function (e) {
    e.preventDefault();
    var a = $(e.currentTarget);
    var data = {
        currentDocumentId: a.data('id'),
        currentDocumentTitle: a.data('title')
    };
    $.ajax({
        url: '/wiki/movedocumentmodal',
        data: data,
        dataType: 'html',
        type: 'GET',
        cache: false,
        success: function (html) {
            moveDocumentModal.html(html);
            moveDocumentModal.modal('show');
        }
    });
});
moveDocumentModal.on('click', 'a.document', function (e) {
    e.preventDefault();
    var a = $(e.currentTarget);
    var data = {
        id: moveDocumentButton.data('id'),
        newParentID: a.data('id')
    };
    $.ajax({
        url: '/wiki/move',
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (response) { window.location.href = response.newLocation; }
    });
});
$('.delete-page').on('click', function (e) {
    var message = 'Are you sure you want to delete this page and all of its ancestors?\n\n'
        + 'Like, REALLY, TOTALLY, COMPLETELY SURE ?\n\n'
        + 'Type YES into the box below and click OK to confirm.\n';
    var result = prompt(message, 'NO');
    return result === 'YES';
});
$('.delete-upload').on('click', function (e) {
    var message = 'Are you sure you want to delete this file?\n\n'
        + 'Like, REALLY, TOTALLY, COMPLETELY SURE ?\n\n'
        + 'Type YES into the box below and click OK to confirm.\n';
    var result = prompt(message, 'NO');
    return result === 'YES';
});
$('.custom-file-input').on('change', function (e) {
    var input = $(e.target);
    var fileName = input.val().split('\\').pop();
    input.siblings('.custom-file-label').addClass('selected').html(fileName);
});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "jquery")))

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })

/******/ });
//# sourceMappingURL=read.js.map