var util = require('util');

var sax = require('sax');

var TreeBuilder = require('./../treebuilder').TreeBuilder;

function XMLParser(target) {
  var self = this;
  this.parser = sax.parser(true);

  this.target = (target) ? target : new TreeBuilder();

  /* TODO: would be nice to move these out */
  this.parser.onopentag = function(tag) {
    self.target.start(tag.name, tag.attributes);
  };

  this.parser.ontext = function(text) {
    self.target.data(text);
  };

  this.parser.oncdata = function(text) {
    self.target.data(text);
  };

  this.parser.ondoctype = function(text) {

  };

  this.parser.oncomment = function(comment) {
    /* TODO: parse comment? */
  };

  this.parser.onclosetag = function(tag) {
    self.target.end(tag);
  };

  this.parser.onerror = function(error) {
    util.debug(error);
    throw error;
  };
}

XMLParser.prototype.feed = function(chunk) {
  this.parser.write(chunk);
};

XMLParser.prototype.close = function() {
  this.parser.close();
  return this.target.close();
};

exports.XMLParser = XMLParser;
