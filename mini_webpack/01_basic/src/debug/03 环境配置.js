import "lodash";

const res = _.union([2], [1, 2]);
console.log('res22', res); // => [2, 1]

console.log('当前环境的NODE_ENV是--', process.env.NODE_ENV);
console.log('当前环境的APP_ENV是--', process.env.APP_ENV);
