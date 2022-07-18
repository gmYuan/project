
// 关于正则可视化，参见：https://jex.im/regulex/#!flags=&re=

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
// ?:匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;


//S1 标签开头的正则 捕获的内容是标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`); 
// console.log('开始标签是', startTagOpen)
// console.log('开始标签测试结果是', '<my_name//:is_ygm>'.match(startTagOpen))

//S2 匹配标签结尾的 </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// console.log('结束标签是', endTag)

//S3 匹配属性 aaa="aaa"  a='aaa'   a=aaa
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; 

//S4 匹配标签的右箭头>
const startTagClose = /^\s*(\/?)>/; 

//S5 匹配Vue里的变量模版 双大括号 {{ }}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;