import { parseHTML } from "./parse";
import { generate } from "./generate";

// 作用：把 html模板 => render函数
// 流程: html转化为AST => with + new Function
export function compileToFunctions(template) {
  // 1.把html代码转化成 "ast"语法 （ast树，可以用来描述语言本身）
  let root = parseHTML(template);

  // 2.生成代码 
  let code = generate(root)
}
