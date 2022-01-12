import "lodash";

const res = _.union([2], [1, 2]);
console.log('res22', res); // => [2, 1]

function sum() {
    const res2 = Array.from(arguments);
    return res2;
}
console.log(sum(1, 2));

const p1 = Promise.resolve('promise结果');
console.log('p1是', p1);
