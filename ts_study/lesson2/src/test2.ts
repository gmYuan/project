//import jQuery from 'jquery';
//为什么会报错 ?
//导出的时候是common.js ,但是在你在这里是通过es默认导入的
import * as jQuery from "jquery";
jQuery.ajax('url');

//export = jQuery; 这是一种TS的语法,表示要导出jQuery
//es6导出 也支持 common.js导出
/* export default jQuery;
module.exports = jQuery; */
//export { jQuery };
//export default jQuery;