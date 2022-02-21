let nunjucks = require('nunjucks');
let ejs = require('ejs');
nunjucks.configure({autoescape:true});//自动转译
/* let result = nunjucks.renderString(
    `
    {% if score >=90 %}
      优秀
    {% elseif score >=80 %}
    良好
    {% elseif score >=70 %}
     中等
    {% elseif score >=60 %}
    及格
    {% else %}
    不及格
    {% endif %}
    `,{score:55}
);
//>=90 优秀 >=80 良好 >=70 中等 >=60 及格 <60 不及格

console.log(result);
 */
function render(tempStr,data){
  eval(tempStr);
}
let result2 = ejs.render(
    `{%
      if(score >=90){
        %>优秀<%
      }else if(score >=80){
         %>良好<%
      }
    %}`,{score:98}
);
console.log(result2);