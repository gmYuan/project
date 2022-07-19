
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


// 看一下用户是否传入了 , 没传入可能传入的是 template, template如果也没有传递
// 将我们的html =》 词法解析  （开始标签 ， 结束标签，属性，文本）
// => ast语法树 用来描述html语法的 stack=[]

// codegen  <div>hello</div>  =>   _c('div',{},'hello')  => 让字符串执行
// 字符串如果转成代码 eval 好性能 会有作用域问题

// 模板引擎 new Function + with 来实现


// ast (语法层面的描述 js css html) vdom （dom节点）
// html字符串解析成 对应的脚本来触发 tokens  <div id="app"> {{name}}</div>
// 将解析后的结果 组装成一个树结构  栈


let root;
let currentParent;
let stack = [];

export function parserHTML(html) {
    while (html) { //只要html不为空字符串就一直解析
        let textEnd = html.indexOf('<'); // 当前解析的开头  
         // 说明是 标签，处理标签
        if (textEnd == 0) {   
            const startTagMatch = parseStartTag(html); // 解析开始标签
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue;
            }
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {  // 处理结束标签
                end(endTagMatch[1]);
                advance(endTagMatch[0].length);
                continue;
            }
        }
        // 处理文本
        let text; 
        if (textEnd > 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            chars(text);
            advance(text.length);
        }
    }
    return root;

    // 将字符串进行截取操作 + 更新html内容
    function advance(len) {
        html = html.substring(len);
    }
}


function parseStartTag(html) {
    const start = html.match(startTagOpen);
    if (start) {
        const match = {
            tagName: start[1],
            attrs: []
        }
        // 删除开始标签内容
        advance(start[0].length);

      
        let end;
        let attr;
        // 如果没有遇到标签结尾就不停的解析
        // 能匹配到属性
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
            advance(attr[0].length) //  // 去掉当前属性
        }
        // 删除匹配到的结束标签 >
        if (end) {
            advance(end[0].length);
        }
        return match;
    }
    return false; // 不是开始标签
}

function start(tagName, attrs) { // 创建一个元素 作为根元素
    let element = createASTElement(tagName, attrs);
    if(!root){
        root = element;
    }
    currentParent = element; // 当前解析的标签 保存起来
    stack.push(element); // 将生产的ast元素放到栈中
}

function createASTElement(tagName, attrs) {
    return {
        tag: tagName, // 标签名
        type: 1, // 元素类型
        children: [], // 孩子列表
        attrs, // 属性集合
        parent: null // 父元素
    }
}



// <div> <p></p> hello</div>    currentParent=p
function end(tagName) { // 在结尾标签处 创建父子关系
    let element = stack.pop(); // 取出栈中的最后一个
    currentParent = stack[stack.length-1];
    if(currentParent){ // 在闭合时可以知道这个标签的父亲是谁
        element.parent = currentParent;
        currentParent.children.push(element);
    }
}

function chars(text) {
    text = text.trim();
    if(text){
        currentParent.children.push({
            type:3,
            text
        })
    }
}

