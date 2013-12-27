'use strict';

var utils = new (require('./utils')).Utils();

function Sample(features, label) {
    this.features = features; //= [];
    this.label = label;
}

function Dataset(types) {
    this.types = types;
    this.samples = [];
}

Dataset.prototype = {

    add: function (sample) {
        this.samples.push(sample);
    },

    count: function() {
        return this.samples.length
    },

    createLabelsMap: function() {
        var map = {};
        var count = this.count();
        for(var i = 0; i < count; i++) {
            var t = this.samples[i].label;
            map[t] = isNaN(map[t]) ? map[t] = 1 : map[t] + 1;
        }
        return map;
    },

    getEntropy: function() {
        var count = this.count();
        var map = this.createLabelsMap();
        utils.normalize(map, count);
        return utils.entropy(map);
    }
};

exports.Sample = Sample;
exports.Dataset = Dataset;