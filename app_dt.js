'use strict';

var fs  = require('fs');
var tds = require('./lib/dataset');
var tdt = require('./lib/dt');

var ds = new tds.Dataset(['N', 'N', 'N', 'N']);

fs.readFileSync('./data/iris.csv').toString().split('\r\n').forEach(function (line) {
    var arr = line.split(',').map( function (x) { return parseFloat(x); } );
    ds.add(new tds.Sample([ arr[0], arr[1], arr[2], arr[3] ], arr[4]));
});

//console.log(ds.samples[0].features);
//console.log(ds.samples[0].label);

var dt = new tdt.DTree(ds);

var ds2 = new tds.Dataset(['N', 'N', 'N', 'N']);
ds2.add(new tds.Sample([5.1, 3.4, 1.5, 0.2], null));  //0
var p = dt.predict(dt.root, ds2);
console.log('should be 0 = ');
console.log(p);

//
ds2 = new tds.Dataset(['N', 'N', 'N', 'N']);
ds2.add(new tds.Sample([7.1, 3.0, 5.9, 2.1], null));  //2
p = dt.predict(dt.root, ds2);
console.log('should be 2 = ');
console.log(p);

ds2 = new tds.Dataset(['N', 'N', 'N', 'N']);
ds2.add(new tds.Sample([6.3, 2.5, 4.9, 1.5], null));  //1
p = dt.predict(dt.root, ds2);
console.log('should be 1 = ');
console.log(p);


