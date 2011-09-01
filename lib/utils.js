/**
 * @param {Object} hash.
 * @param {Array} ignored.
 */
function items(hash, ignored) {
  ignored = ignored || null;
  var k, rv = [];

  function is_ignored(key) {
    if (!ignored || ignored.length === 0) {
      return false;
    }

    return ignored.indexOf(key);
  }

  for (k in hash) {
    if (hash.hasOwnProperty(k) && !(is_ignored(ignored))) {
      rv.push([k, hash[k]]);
    }
  }

  return rv;
}


function findall(re, str) {
  var match, matches = [];

  while ((match = re.exec(str))) {
      matches.push(match);
  }

  return matches;
}

exports.items = items;
exports.findall = findall;
