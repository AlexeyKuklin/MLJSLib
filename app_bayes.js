'use strict';

var fs  = require('fs');
var tds = require('./lib/dataset');
var ds = new tds.Dataset(null);

ds.add(new tds.Sample(['предоставляю', 'услуги', 'бухгалтера'], 'spam'));
ds.add(new tds.Sample(['спешите', 'купить', 'мерседес'], 'spam'));
ds.add(new tds.Sample(['надо', 'купить', 'молоко'], 'ham'));

var bayes = new (require('./lib/bayes')).Bayes();
bayes.train(ds);
var p = bayes.predict(new tds.Sample(['надо', 'купить', 'сигареты'], null), false);
console.log(p);

