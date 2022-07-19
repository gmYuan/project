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
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

//S4 匹配标签的右箭头>
const startTagClose = /^\s*(\/?)>/;

//S5 匹配Vue里的变量模版 双大括号 {{ }}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

let root;

/**
作用: 把html模板内容转化为 AST节点对象

流程:
S1 解析模板内的 标签： startTagMatch / endTagMatch
  - startTagMatch: parseStartTag + start
  - endTagMatch: end +  advance
 
S2 解析模板内的 文本：chars + advance  
*/

let html;

export function parseHTML(sourceHTML) {
  html = sourceHTML;
  while (html) {
    //只要html不为空字符串就一直解析
    let textEnd = html.indexOf("<"); // 当前解析的开头
    // S1 说明是标签(开始/结束标签) ==> 处理标签
    if (textEnd == 0) {
      // 解析开始标签
      const startTagMatch = parseStartTag(html);
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      // 解析结束标签
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    }
    //S2 处理文本
    let text;
    if (textEnd > 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      chars(text);
      advance(text.length);
    }
  }
  return root;
}

// 将字符串进行截取操作 + 更新html内容
function advance(len) {
  html = html.substring(len);
}

// 处理开始标签
function parseStartTag(html) {
  const start = html.match(startTagOpen);
  if (start) {
    const match = {
      tagName: start[1],
      attrs: [],
    };
    // 删除开始标签左半部分：<div id='app'> 中的 <div
    advance(start[0].length);

    let end;
    let attr;
    // 如果没有遇到开始标签的结尾，就不停的解析
    // 能匹配到属性
    while (
      !(end = html.match(startTagClose)) &&
      (attr = html.match(attribute))
    ) {
      // 保存属性值
      match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] });
      // 去掉html当前标签里的 属性
      advance(attr[0].length);
    }
    // 删除匹配到的开始标签的 右结束标签 >
    if (end) {
      advance(end[0].length);
    }
    return match;
  }
  return false; // 不是开始标签
}

function start(tagName, attrs) {
  console.log("开始标签是", tagName);
  console.log("开始标签属性是", attrs);
}

// 处理结束标签
function end(tagName) {
  console.log("结束标签是", tagName);
}

// 处理文本
function chars(text) {
  console.log("文本是", text);
}
