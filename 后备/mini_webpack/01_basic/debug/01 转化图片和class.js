import React from 'react';
import ReactDOM from 'react-dom';

import logo from '../assets/images/logo.png';
import '../index.css';
import '../less.less';

const hello = require('../assets/title.txt').default;

// 转化文件
const rootEle = document.body.querySelector('#root');
const txtEle = document.createTextNode(hello);
rootEle.appendChild(txtEle);

// 转化图片
const imgEle = new Image();
imgEle.src = logo;
rootEle.appendChild(imgEle);

// 转化Class和decorator

function readonly(target, key, desc) {
    // eslint-disable-next-line no-param-reassign
    desc.writable = false;
}
class Person {
    // @readonly PI = 3.14
    PI = 3.14;
}

const p = new Person();
p.PI = 3.15;
console.log(p);
console.log('3333');

/**
// 转化ES6
const add = (a,b) => a + b
console.log('add', add(3, 6))∏

// 转化JSX
const ele1 = <div>我是react- JSX</div>
ReactDOM.render(ele1, document.getElementById('root'))

 * */
