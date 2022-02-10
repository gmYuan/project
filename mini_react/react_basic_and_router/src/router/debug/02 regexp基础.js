const { pathToRegexp } = require("path-to-regexp")
//可以把一个字符串转成正则表达式
let keys = []
/**
 * strict 是否允许 结尾有一个可选的/
 * sensitive 是否大小写敏感
 * end是否匹配整个字符串，true 整个字符串，如果false 匹配前缀
 */

// 例1 基本使用
/**
let regexp = pathToRegexp('/home', keys, { end:false } )
console.log(regexp)
console.log(regexp.test('/home'))
console.log(regexp.test('/home/'))
console.log(regexp.test('/home//'))
*/


// --------------------------------------------------
// 例2 路径参数 + 生成路由的 params
/**
let regexp2 = pathToRegexp('/user/:id/:nickName', keys, { end:false } )
console.log(regexp2)
console.log(keys)
let res1 = '/user/230/ccc'.match(regexp2)
console.log(res1);
console.log(res1.length)
// 通用params的生成原理都是类似于此
keys = keys.map(item=>item.name)
let parmas = keys.reduce((memo, key, index)=>{
    memo[key] = res1[index + 1]
    return memo
}, {})
console.log(parmas)
*/


// --------------------------------------------------
// 例3 捕获分组/非捕获分组/命名捕获分组
/**
 *  ()     捕获分组
 * (?:)   非捕获分组
 * (?...)   命名捕获分组
 */
let regexp3 = /\/user(\d+)(?:[a-z]+)/
let value = '/user300home'
let res = value.match(regexp3)
// console.log(res)
//  ['/user300', '300', index: 0, input: '/user300home', groups: undefined]
// 第1个元素是匹配到的字符串内容，第2～n个元素是捕获 分组1，分组2....

//?<x> 表示命名捕获分组
// console.log( /(?<x>\d{2})-(?<y>\d{2})/.exec('11-22') )
// console.log( '11-22'.replace(/(?<x>\d{2})-(?<y>\d{2})/, "$<y>-$<x>") )


// --------------------------------------------------
// 例4 肯定前瞻/ 否定前瞻/ 肯定后顾/ 否定后顾
console.log('捕获分组',    '1ab'.match(/1([a-z])([b-c])/) )
console.log('不捕获分组',  '1ab'.match(/1(?:[a-z])([b-c])/) )
//肯定前瞻 不消耗字符
console.log('肯定前瞻',   '1ab'.match(/\d(?=[a-z])([a-z])/) )
//否定前瞻 不消耗字符
console.log('否定前瞻',   '1a'.match(/\d(?![A-Z])[a-z]/))

//肯定后顾 不消耗字符
console.log('肯定后顾',   'b1a'.match(/(?<=[a-z])\d[a-z]/))
//否定后顾 不消耗字符
console.log('否定后顾',  'A1a'.match(/(?<![a-z])\d[a-z]/));