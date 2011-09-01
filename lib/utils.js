function findall(re, str) {
  var match, matches = [];

  while ((match = re.exec(str))) {
      matches.push(match);
  }

  return matches;
}

exports.findall = findall;
