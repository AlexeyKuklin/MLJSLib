'use strict';

function Utils() {
}

Utils.prototype = {

    normalize: function(map, count) {
        for(var i in map) {
            map[i] /= count;
        }
    },

    entropy: function(p) {     // ln
        var e = 0.0;
        for(var i in p) {
            e += p[i] * Math.log(p[i]);
        }
        return -e;
    },

    /**
     * Takes an array of decimal numbers 0 <= d <= 1 which sum to 1, and randomly returns the index one one based on decimal 'weight',
     * i.e. indices closer to 1 have a greater chance of being selected.
     * @param {array} w - An array of decimal numbers 0 <= d <= 1 which sum to 1.
     */
     weightedRandom: function (w){
        var r = Math.random();

        for(var i = 0; i < w.length; i++) {
            if(r < w[i])
                return i;
            r -= w[i];
        }
        //shouldn't happen.
        return -1;
     },

    // generate random floating point number between a and b
    randf: function (a, b) {
        return Math.random()*(b-a)+a;
    },

    // generate random integer between a and b (b excluded)
    randi: function (a, b) {
        return Math.floor(Math.random()*(b-a)+a);
    },

    sigmoid: function (x) {
        return 1 / (1 + Math.exp(-x));
    }

    //tokenize: function (text) {
    //    return text.toLowerCase().replace(/\W/g, ' ').replace(/\s+/g, ' ').trim().split(' '); //.unique();
    //}

};

exports.Utils = Utils;