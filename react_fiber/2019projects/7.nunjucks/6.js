let nunjucks = require('nunjucks');
nunjucks.configure({autoescape:true});//自动转译
let result = nunjucks.renderString(
    `
    <ul>
      {% for user in users %}
        <li data-id="{{user.id}}">{{loop.index0}}:{{user.name}}</li>
      {% endfor %}
    </ul>
    `,{users:[{id:1,name:'zhufeng1'},{id:2,name:'zhufeng2'}]}
);
//>=90 优秀 >=80 良好 >=70 中等 >=60 及格 <60 不及格

console.log(result);