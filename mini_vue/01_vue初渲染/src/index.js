// 入口：对Vue进行声明和扩展
import { initMixin } from "./init";

function Vue(options){
   //S1 初始化数据
   this._init(options); 
}

//代码技巧：对Vue对象的 原型进行扩展==> 写成一个个的插件，从而解偶代码
initMixin(Vue);

export default Vue;