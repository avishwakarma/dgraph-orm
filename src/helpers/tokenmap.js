const types = require('./types');

const tokenmap = {};

tokenmap[types.STRING] = [
  'exact',
  'hash',
  'term',
  'fulltext',
  'trigram'
];

tokenmap[types.DATETIME] = [
  'year',
  'month',
  'day',
  'hour'
];

module.exports = tokenmap;