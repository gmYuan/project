const hello = require('./assets/title.txt').default
import logo from './assets/images/logo.png'
import './index.css'
import './less.less'

let rootEle = document.body.querySelector('#root')
const txtEle = document.createTextNode(hello)
rootEle.appendChild(txtEle)

const imgEle = new Image()
imgEle.src = logo
rootEle.appendChild(imgEle)

const add = (a,b) => a + b
console.log('add', add(3, 6))
