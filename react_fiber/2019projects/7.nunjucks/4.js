let nunjucks = require('nunjucks');
nunjucks.configure({autoescape:true});//自动转译
let result = nunjucks.renderString(
    `hello {{names | join('-')}}`,{names:['a','b','c']}
);
let result2 = nunjucks.renderString(
    `hello {{name | replace('feng','leng') | capitalize}}`,{name:'zhu feng'}
);
console.log(result2);