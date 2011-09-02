/*
 *  Copyright 2011 Rackspace
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

/* TODO: support node-expat C++ module optionally */

var util = require('util');
var parsers = require('./parsers/index');

function TreeBuilder(element_factory) {
  this._data = [];
  this._elem = [];
  this._last = null;
  this._tail = null;
  if (!element_factory) {
    /* evil circular dep */
    element_factory = require('./elementtree').Element;
  }
  this._factory = element_factory;
}

TreeBuilder.prototype.close = function() {
  return this._last;
};


TreeBuilder.prototype._flush = function() {
  if (this._data) {
    if (this._last !== null) {
      var text = this._data.join("");
      if (this._tail) {
        this._last.tail = text;
      }
      else {
        this._last.text = text;
      }
    }
    this._data = [];
  }
};

TreeBuilder.prototype.data = function(data) {
  this._data.push(data);
};


TreeBuilder.prototype.start = function(tag, attrs) {
  this._flush();
  var elem = this._factory(tag, attrs);
  this._last = elem;

  if (this._elem.length) {
    this._elem[this._elem.length - 1].append(elem);
  }

  this._elem.push(elem);

  this._tail = null;
};

TreeBuilder.prototype.end = function(tag) {
  this._flush();
  this._last = this._elem.pop();
  if (this._last.tag !== tag) {
    throw new Error("end tag mismatch");
  }
  this._tail = 1;
  return this._last;
};

function get_parser(name) {
  if (name === 'sax') {
    return parsers.sax;
  }
  else {
    throw new Error('Invalid parser: ' + name);
  }
}


exports.TreeBuilder = TreeBuilder;
exports.get_parser = get_parser;
