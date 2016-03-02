/* jshint node:true, esversion:6 */
'use strict';

var pmxcores = require('../lib/pmx-cores');
var t = require('tap');

pmxcores.info((cpu) => {
  t.ok(cpu);
});

pmxcores.usage((usage) => {
  t.ok(usage);
});

pmxcores.usage((usage) => {
  t.ok(usage);
}, true);
