'use strict';

var dist = require('./lib/distribution');

var z = new dist.Ziggurat();

var i = 100;
while(--i) {
    console.log(z.nextGaussian());
}

