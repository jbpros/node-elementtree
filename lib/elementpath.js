var sprintf = require('sprintf').sprintf;

var utils = require('./utils');

var _cache = {};

var RE = new RegExp(
  "(" +
  "'[^']*'|\"[^\"]*\"|" +
  "::|" +
  "//?|" +
  "\\.\\.|" +
  "\\(\\)|" +
  "[/.*:\\[\\]\\(\\)@=])|" +
  "((?:\\{[^}]+\\})?[^/:\\[\\]\\(\\)@=\\s]+)|" +
  "\\s+", 'g'
)

xpath_tokenizer = utils.findall.bind(null, RE);

function prepare_tag(next, token) {
  var tag = token[0];

  function select(context, result) {
    var i, len, elem, rv = [];

    for (i = 0, len = result.length; i < len; i++) {
      elem = result[i];
      elem._children.forEach(function(e) {
        if (e.tag === tag) {
          rv.push(e);
        }
      });
    }

    return rv;
  }

  return select;
}

function prepare_star(next, token) {
  function select(context, result) {
    var i, leni, elemi, j, lenj, elemj, rv = [];

    for (i = 0, leni = result.length; i < leni; i++) {
      elemi = result[i];
      for (j = 0, lenj = elemi.length; j < lenj; j++) {
        elemj = elemi[j];

        rv.push(elemj);
      }
    }

    return rv;
  }

  return select;
}

function prepare_dot(next, token) {
  function select(context, result) {
    var i, len, elem, rv = [];

    for (i = 0, len = result.length; i < len; i++) {
      elem = result[i];
      rv.push(elem);
    }

    return rv;
  }

  return select;
}

function prepare_iter(next, token) {
  // TODO
}

function prepare_dot_dot(next, token) {
  function select(context, result) {
    var i, len, elem, rv = [], parent_map = context.parent_map;

    if (!parent_map) {
      context.parent_map = parent_map = {};

      context.root.iter(function(p) {
        p.iter(function(e) {
          parent_map[e] = p;
        });
      });
    }

    for (i = 0, len = result.length; i < len; i++) {
      elem = result[i];

      if (parent_map.hasOwnProperty(elem)) {
        rv.push(elem);
      }
    }

    return rv;
  }

  return select;
}


function prepare_predicate(next, token) {
  // TODO
}



var ops = {
  "": prepare_tag,
  "*": prepare_star,
  ".": prepare_dot,
  "..": prepare_dot_dot,
  "//": prepare_iter,
  "[": prepare_predicate,
};

function _SelectorContext(root) {
  this.parent_map = null;
  this.root = root;
}

function find(element, path) {
  var resultElement = findall(element, path);

  if (resultElement) {
    return resultElement;
  }

  return null;
}

function findall(elem, path) {
  var selector, result, i, len, token, value, select, context;

  if (_cache.hasOwnProperty(path)) {
    selector = _cache[path];
  }
  else {
    // TODO: Use smarter cache purging approach
    if (Object.keys(_cache).length > 100) {
      _cache = {};
    }

    if (path.charAt(0) === '/') {
      throw new Error('cannot use absolte path on element');
    }

    result = xpath_tokenizer(path);
    selector = [];

    i = 0;
    token = result[i];

    while (true) {
      // TODO: handle invalid path error
      var c = token[1] || '';
      value = ops[c](result[i + 1], token);

      if (!value) {
        throw new Error(sprintf('invalid path: %s', path));
      }

      selector.push(value);

      i++;
      token = result[i];

      if (!token) {
        break;
      }
      else if (token[1] === '/') {
        token = result[++i];
      }
    }

    _cache[path] = selector;
    // Execute slector pattern
    result = [elem];
    context = _SelectorContext(elem);

    for (i = 0, len = selector.length; i < len; i++) {
      select = selector[i];
      result = select(context, result);
    }

    return result;
  }
}

function findtext(element, path, defvalue) {
  var resultElement = findall(element, path);

  if (resultElement) {
    return resultElement.text;
  }

  return defvalue;
}


exports.find = find;
exports.findall = findall;
exports.findtext = findtext;
