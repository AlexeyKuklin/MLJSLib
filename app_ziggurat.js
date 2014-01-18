'use strict';

var dist = require('./lib/distribution');

var z = new dist.Ziggurat();

var i = 100000000;
while(--i) {
    z.nextGaussian();
    //console.log(z.nextGaussian());
}

