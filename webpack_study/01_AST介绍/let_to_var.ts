import { parse } from "@babel/parser"
import traverse from "@babel/traverse"
import generate from "@babel/generator"

/** 
AST原理
parse: 把代码 code 变成 AST
traverse: 遍历AS，支持修改AST
generate: 把 AST 变成代码 code2
即 
S1  code1 --parse--> ast1
S2  ast1 --traverse--> ast2 
S3  ast2 --generate--> code2

*/

const code = `let a = 'let'; let b = 2`

const ast = parse(code, {sourceType: 'module'})
// console.log('ast', ast)

traverse(ast, {
  enter: (item) => {
    console.log('item', item)
  }
})




// const ast = parse(code, { sourceType: 'module' })
// traverse(ast, {
//   enter: item => {
//     if(item.node.type === 'VariableDeclaration'){
//       if(item.node.kind === 'let'){
//         item.node.kind = 'var'
//       }
//     }
//   }
// })
// const result = generate(ast, {}, code)
// console.log(result.code)