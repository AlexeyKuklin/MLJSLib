'use strict';

var dist = require('./lib/distribution');

var mt = new dist.MersenneTwister(123);

var i = 10000000;
while(--i) {
    mt.random();
    //console.log(mt.random());
}
