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

var et = require('elementtree');

exports['test_error_type'] = function(test, assert) {
  /* Ported from <https://github.com/lxml/lxml/blob/master/src/lxml/tests/test_elementtree.py> */
  var Element = et.Element
  var root = Element('root');
  root.append(Element('one'));
  root.append(Element('two'));
  root.append(Element('three'));
  assert.equal(3, root.len())
  assert.equal('one', root.getItem(0).tag)
  assert.equal('two', root.getItem(1).tag)
  assert.equal('three', root.getItem(2).tag)
  test.finish();
};
