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

var sprintf = require('./sprintf').sprintf;

function merge(a, b) {
  var c = {}, attrname;

  for (attrname in a) {
    if (a.hasOwnProperty(attrname)) {
      c[attrname] = a[attrname];
    }
  }
  for (attrname in b) {
    if (b.hasOwnProperty(attrname)) {
      c[attrname] = b[attrname];
    }
  }
  return c;
};

var element_ids = 0;

function Element(tag, attrib)
{
  this._id = element_ids++;
  this.tag = tag;
  this.attrib = {};
  this.text = null;
  this.tail = null;
  this._children = [];

  if (attrib) {
    this.attrib = merge(this.attrib, attrib);
  }
}

Element.prototype.toString = function() 
{
  return sprintf("<Element %s at %s>", this.tag, this._id)
};

Element.prototype.makeelement = function(tag, attrib)
{
  return new Element(tag, attrib);
};

Element.prototype.len = function()
{
  return this._children.length;
};

Element.prototype.getItem = function(index)
{
  return this._children[index];
};

Element.prototype.setItem = function(index, element)
{
  this._children[index] = element;
};

Element.prototype.delItem = function(index)
{
  this._children.splice(index, 1);
};

Element.prototype.getSlice = function(start, stop)
{
  return this._children.slice(start, stop);
};

Element.prototype.setSlice = function(start, stop, elements)
{
  var i;
  var k = 0;
  for (i = start; i < stop; i++, k++) {
    this._children[i] = elements[k];
  }
  return rv;
};

Element.prototype.delSlice = function(start, stop)
{
  this._children.splice(start, stop - start);
};

Element.prototype.append = function(element)
{
  this._children.push(element);
};

Element.prototype.extend = function(elements)
{
  this._children.concat(elements);
};

Element.prototype.insert = function(index, element)
{
  this._children[index] = element;
};

Element.prototype.remove = function(index, element)
{
  this._children = this._children.filter(function(e) {
    /* TODO: is this the right way to do this? */
    if (e._id == element._id) {
      return false;
    }
    return true;
  });
};


Element.prototype.find = function(path)
{
  throw new Error('element.find not implemented');
};

Element.prototype.findtext = function(path, defvalue)
{
  throw new Error('element.findtext not implemented');
};

Element.prototype.findall = function(path, defvalue)
{
  throw new Error('element.findall not implemented');
};

Element.prototype.clear = function()
{
  this.attrib = {};
  this._children = [];
  this.text = null;
  this.tail = null;
};

Element.prototype.get = function(key, defvalue)
{
  if (this.attrib[key] !== undefined) {
    return this.attrib[key];
  }
  else {
    return defvalue;
  }
};

Element.prototype.set = function(key, value)
{
  this.attrib[key] = value;
};

Element.prototype.keys = function()
{
  return Object.keys(this.attrib);
};

Element.prototype.items = function()
{
  var rv = [];
  for (var k in this.attrib) {
    if (this.attrib.hasOwnProperty(k)) {
      rv.push(this.attrib[k]);
    }
  }
  return rv;
};

/*
 * In python this uses a generator, but in v8 we don't have em,
 * so we use a callback instead.
 **/
Element.prototype.iter = function(tag, callback)
{
  var self = this;
  var i, child;

  if (tag == "*") {
    tag = null;
  }

  if (tag === null || this.tag == tag) {
    callback(self);
  }

  for (i = 0; i < this._children.length; i++) {
    child = this._children[i];
    child.iter(tag, function(e) {
      callback(e);
    });
  }
};

Element.prototype.itertext = function(callback)
{
  this.iter(null, function(e) {
    if (e.text) {
      callback(e.text);
    }

    if (e.tail) {
      callback(e.tail);
    }
  })
};


function SubElement(parent, tag, attrib) {
  element = parent.makeelement(tag, attrib);
  parent.append(element);
  return element;
};

exports.SubElement = SubElement;

exports.Element = function(tag, attrib) {
  return new Element(tag, attrib);
};

function Comment(text) {
  var element = new Element(Comment);
  if (text) {
    element.text = text;
  }
  return element;
};

function ProcessingInstruction(target, text)
{
  var element = new Element(ProcessingInstruction);
  element.text = target;
  if (text) {
    element.text = element.text + " " + text;
  }
  return element;
}

exports.PI = ProcessingInstruction;
exports.ProcessingInstruction = ProcessingInstruction;

function ElementTree(element)
{
  this._root = element;
};

ElementTree.prototype.getroot = function() {
  return this._root;
};

ElementTree.prototype._setroot = function(element) {
  this._root = element;
};

ElementTree.prototype.parse = function(source, parser) {
  if (!parser) {
    parser = new XMLParser(new TreeBuilder());
  }
  parser.feed(source);
  this._root = parser.close();
  return this._root;
};

ElementTree.prototype.iter = function(tag, callback) {
  this._root.iter(tag, callback);
};

ElementTree.prototype.find = function(path) {
  return this._root.find(path);
};

ElementTree.prototype.findtext = function(path, defvalue) {
  return this._root.findtext(path, defvalue);
};

ElementTree.prototype.findall = function(path) {
  return this._root.findall(path);
};

var e = new Element('foo', {});
console.log(e);
console.log(e.toString());

var e = new Element('bar', {});
console.log(e);
console.log(e.toString());
console.log('-----');
e.iter(null, console.log);
console.log('-----');
