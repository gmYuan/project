/**
 * hash           每次构建会生成一个统一的hash值
 *
 * chunkHash  代码块hash,每个代码块共享 一个hash值
 *                  是通过属于这个chunk的所有的模块计算出来的
 *
 * contentHash 内容hash,根据文件的内容生成的hash
 *
 * 影响范围越来越小，本次编译->代码块(入口)->单个文件
 *
 *  变化从快到慢分别是  hash>chunkhash>contenthash

 * Q: 一个代码块可产出多个文件 main main.js main.css
 * chunk里面那么多文件，
 * 取哪个文件的contenthash来作为 最终生成的assets文件名呢
 *
 * A：
 * assets和文件是一对一的
 * main代码块会产出2个assets: main.js main.css
 * main.js / main.css 又会生成2个文件
 *
 *
 */

const crypto = require('crypto');

const entry = {
    entry1: 'page1',
    entry2: 'page2',
};
const page1 = 'require title1'; // 模块
const page2 = 'require title2'; // 模块

const title1 = 'title1';// 模块
const title2 = 'title2';// 模块

// contentHash
const title1ContentHash = crypto.createHash('md5').update(title1).digest('hex');
console.log('title1ContentHash', title1ContentHash);

// chunkHash
const page1ChunkHash = crypto.createHash('md5').update(page1).update(title1).digest('hex');
console.log('page1ChunkHash', page1ChunkHash);
const page2ChunkHash = crypto.createHash('md5').update(page2).update(title2).digest('hex');
console.log('page2ChunkHash', page2ChunkHash);

const hash = crypto.createHash('md5')
.update(page1)
.update(title1)
.update(page2)
.update(title2)
.digest('hex');
console.log('all hash', hash);
