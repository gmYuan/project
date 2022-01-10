import "lodash";

const res = _.union([2], [1, 2]);
console.log('res22', res); // => [2, 1]

console.log('当前环境是--', process.env.MY_NODE_ENV);
