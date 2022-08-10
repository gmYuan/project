import { parseHTML } from "./parse";
import { generate } from "./generate";

// 作用：把 html模板 => render函数
// 流程: html转化为AST => with + new Function
export function compileToFunctions(template) {
  //1. 把html代码转化成 "ast"语法 （ast树，可以用来描述语言本身）
  let ast = parseHTML(template);

  //2. 字符串拼接(模板引擎), 生成函数体
  let fnBody = generate(ast);
   
  // 3. 注入变量上下文环境 new Function + with
  let renderFn = new Function(`with(this){ return ${fnBody}}`); 

  // vue的render函数执行，返回的就是虚拟dom
  // console.log('render--', renderFn)
  return renderFn;
}
