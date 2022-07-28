// 核心思路就是将模板转化成 下面这段字符串
// 即 把AST对象 转化为Render函数的 函数体

// <div id="app" style="color:red"> <p>hello {{name}} </p> hello </div>
// 将ast树 再次转化成js的语法
// _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name) )),_v('hello')) 


const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// 生成host元素类型标签 对应的 字符串
export function generate(el) {
    let children = genChildren(el);
    let code = `_c('${el.tag}',${
        el.attrs.length? `${genProps(el.attrs)}`:'undefined'
    }${
        children?`,${children}`:''
    })`;
    return code;
}


// 拼接属性
function genProps(attrs) {
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            let obj = {}; // 对样式进行特殊的处理 
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':');
                obj[key] = value;
            });
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }
    return `{${str.slice(0,-1)}}`;
}


// 处理标签 子节点对应的 字符串
function genChildren(el){
    let children = el.children;
    if(children && children.length > 0){
        return `${children.map(c => gen(c)).join(',')}`
    } else {
        return false;
    }
}


function gen(node){
    // 元素类型标签， 递归调用
    if(node.type == 1){
        return generate(node);
        // 处理文本节点 和 变量文本节点
    } else {
        // 节点内容举例: <div>a {{  name  }} b{{age}} c </div>
        let text = node.text; 
        let tokens = [];
        let match,index;
        // 变量含义: 每次的偏移量
        // 正则特性: 只要是全局匹配 就需要将lastIndex每次匹配的时候调到0处
        let lastIndex = defaultTagRE.lastIndex = 0; 
        while(match = defaultTagRE.exec(text)){
            index = match.index;
            // 纯文本类型
            if(index > lastIndex){
                tokens.push(JSON.stringify(text.slice(lastIndex,index)));
            }
            // 变量文本类型
            tokens.push(`_s(${match[1].trim()})`);
            lastIndex = index + match[0].length;
        }
        // 剩余的 纯文本类型
        if(lastIndex < text.length){
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return `_v(${tokens.join('+')})`;
    }
}