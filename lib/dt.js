'use strict';

var utils = new (require('./utils')).Utils();
var tds = require('./dataset');

function Node () {
    this.left = null;
    this.right = null;
    this.column = null;
    this.value = null;
    this.labels = null;    // {}
}

function DTree (dataset) {
    this.root = this.build(dataset);
    return this;
}

DTree.prototype = {

    split: function(dataset, column, value) {
        var left = new tds.Dataset(dataset.types);
        var right = new tds.Dataset(dataset.types);

        var i, t;
        var count = dataset.count();
        var type = dataset.types[column];
        switch(type) {
            case 'C':
                for (i = 0; i < count; i++) {
                    t = dataset.samples[i];
                    if (t.features[column] == value) {
                        left.add(t);
                    } else {
                        right.add(t);
                    }
                }
                break;
            case 'N':
                for (i = 0; i < count; i++) {
                    t = dataset.samples[i];
                    if (t.features[column] <= value) {
                        left.add(t);
                    } else {
                        right.add(t);
                    }
                }
                break;
        }

        return {
            left: left,
            right: right
        };
    },

    predict: function(node, dataset) {

        if(node.labels) {    //leaf node
            return node.labels;
        }

        switch(dataset.types[node.column]) {
            case 'C':
                if(dataset.samples[0].features[node.column] == node.value && node.left ) {
                    return this.predict(node.left, dataset);
                } else if (node.right) {
                    return this.predict(node.right, dataset);
                }
                break;
            case 'N':
                if(dataset.samples[0].features[node.column] <= node.value && node.left ) {
                    return this.predict(node.left, dataset);
                } else if (node.right) {
                    return this.predict(node.right, dataset);
                }
                break;
        }

        return null;
    },

    getBestGain: function(dataset, column, entropy) {
        var best = {
            gain: 0,
            value: null,
            total_l : 0,
            total_r : 0
        };

        var map = {};
        var count = dataset.count();
        for(var i = 0; i < count; i++) {
            map[dataset.samples[i].features[column]] = 1;
        }

        for(var value in map) {
            var map_l = {}, map_r = {};
            var total_l = 0, total_r = 0;
            var t;
            switch (dataset.types[column]) {
                case 'C':
                    for(i = 0; i < count; i++) {
                        t = dataset.samples[i].label;
                        if(dataset.samples[i].features[column] == value) {
                            total_l++;
                            map_l[t] = isNaN(map_l[t]) ? map_l[t] = 1 : map_l[t] + 1;
                        } else {
                            total_r++;
                            map_r[t] = isNaN(map_r[t]) ? map_r[t] = 1 : map_r[t] + 1;
                        }
                    }
                    break;
                case 'N':
                    for(i = 0; i < count; i++) {
                        t = dataset.samples[i].label;
                        if(dataset.samples[i].features[column] <= value) {
                            total_l++;
                            map_l[t] = isNaN(map_l[t]) ? map_l[t] = 1 : map_l[t] + 1;
                        } else {
                            total_r++;
                            map_r[t] = isNaN(map_r[t]) ? map_r[t] = 1 : map_r[t] + 1;
                        }
                    }
                    break;
            }

            var p1 =  total_l/count;
            var p2 =  total_r/count;
            utils.normalize(map_l, total_l);
            utils.normalize(map_r, total_r);

            var new_entropy = p1 * utils.entropy(map_l) + p2 * utils.entropy(map_r);

            var entropy_gain = entropy - new_entropy;

            if(entropy_gain >= best.gain) {
                best.gain = entropy_gain;
                best.value = value;
                best.total_l = total_l;
                best.total_r = total_r;
            }
        }

        return best;
    },

    build: function(dataset) {
        var best = {
            gain : 0.0,
            value : null,
            column : null,
            total_l : 0,
            total_r : 0
        };

        var entropy = dataset.getEntropy();

        var cnt = dataset.types.length;
        for(var column = 0; column < cnt; column++) {       //??? only chosen columns?
            var t = this.getBestGain(dataset, column, entropy);
            if(t.gain > best.gain) {
                best = t;
                best.column = column;
            }
        }

        var node = new Node();
        if (best.gain > 0 && best.total_l > 0 && best.total_r > 0) {
            var sds = this.split(dataset, best.column, best.value);
            node.value = best.value;
            node.column = best.column;
            node.left = this.build(sds.left);
            node.right = this.build(sds.right);
        } else {    // leaf node
            node.labels = dataset.createLabelsMap();
        }
        return node;
    }
};

exports.DTree = DTree;