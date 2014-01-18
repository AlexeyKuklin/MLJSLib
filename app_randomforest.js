'use strict';

var fs  = require('fs');
var rf  = require('rf');

fs.readFileSync('./data/iris.csv').toString().split('\r\n').forEach(function (line) {
    var arr = line.split(',').map( function (x) { return parseFloat(x); } );
    ds.add(new tds.Sample([ arr[0], arr[1], arr[2], arr[3] ], arr[4]));
});

var f = new rf.RandomForest();