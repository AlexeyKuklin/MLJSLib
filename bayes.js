'use strict';

function Bayes() {
    this.classFeatures = {};
    this.classTotals = {};
    this.total = 0;
    this.uniqueFeatures = {};
}

Bayes.prototype = {

    add: function(features, label) {
        if(!this.classFeatures[label]) {
            this.classFeatures[label] = {};
            this.classTotals[label] = 0;
        }

        this.total++;
        this.classTotals[label]++;

        for(var i in features) {
            var value = features[i];

            this.uniqueFeatures[value] = 1;

            if(this.classFeatures[label][value]) {
                this.classFeatures[label][value]++;
            } else {
                this.classFeatures[label][value] = 1;
            }
        }
    },

    getClassProbability: function(features, label) {
        var classTotal = this.classTotals[label];

        var uniqueTotal = 0;
        for(var k in this.uniqueFeatures) {
            uniqueTotal++;
        }

        var classTotalCnt = 0;
        for(var key in this.classFeatures[label]) {
            classTotalCnt++;
        }

        var prob = Math.log(classTotal / this.total);
        for(var i in features) {
            prob += Math.log(((this.classFeatures[label][features[i]] || 0) + 1)/(uniqueTotal + classTotalCnt));
        }
        return prob;
    },

    classify: function (features) {

        var labels = [];
        for(var label in this.classFeatures) {
            var value = this.getClassProbability(features, label);
            labels.push({ label: label, value: value });
        }
        return labels;
    },

    train: function(dataset) {
        var count = dataset.count();
        for(var i = 0; i<count; i++) {
            var sample = dataset.samples[i];
            this.add(sample.features, sample.label);
        }
    },

    predict: function(sample, one) {
        var labels = this.classify(sample.features);

        if (one) {
            labels.sort(function(x, y) {
                return y.value - x.value;
            });
            return labels = labels[0].label;
        }

        var max = -Number.MAX_VALUE;
        for(var t in labels) {
            if(labels[t].value > max) {
                max = labels[t].value;
            }
        }

        var sum = 0;
        for(t in labels) {
            sum += Math.exp(labels[t].value - max);
        }
        for(t in labels) {
            labels[t].value = Math.exp(labels[t].value - max)/sum;
        }

        return labels;
    }
};


exports.Bayes = Bayes;