const hello = require('./assets/title.txt').default
import logo from './assets/images/logo.png'
import './index.css'
import './less.less'
import React from 'react'
import ReactDOM  from 'react-dom'

// 转化文件
let rootEle = document.body.querySelector('#root')
const txtEle = document.createTextNode(hello)
rootEle.appendChild(txtEle)

// 转化图片
const imgEle = new Image()
imgEle.src = logo
rootEle.appendChild(imgEle)

// 转化ES6
const add = (a,b) => a + b
console.log('add', add(3, 6))

// 转化JSX
const ele1 = <div>我是react- JSX</div>
ReactDOM.render(ele1, document.getElementById('root'))


