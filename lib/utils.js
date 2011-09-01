function items(hash) {
  var k, rv = [];

  for (k in hash) {
    if (hash.hasOwnProperty(k)) {
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
