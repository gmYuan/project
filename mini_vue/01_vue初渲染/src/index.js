// 入口：对Vue进行声明和扩展
import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifecycleMixin } from "./lifecycle";
import { initGlobalApi } from "./global-api/index";

function Vue(options){
   //S1 初始化数据
   this._init(options); 
}

//代码技巧：对Vue对象的 原型进行扩展==> 写成一个个的插件，从而解偶代码
initMixin(Vue);

renderMixin(Vue);    // 定义vm._render
lifecycleMixin(Vue); // 定义vm._update

// 直接在类上扩展
initGlobalApi(Vue);

export default Vue;