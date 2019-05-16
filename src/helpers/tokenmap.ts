import types from './types';

const tokenmap: {[index: string]: any} = {};

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

export default tokenmap;