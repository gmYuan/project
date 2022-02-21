import fetch from 'dva/fetch';
const BASE_URL = 'http://127.0.0.1:7001';
export  default function(url,options={}){
  options.headers = options.headers||{};
  let token = localStorage.getItem('token');
  if(token){//如果有token的值，就把token通过请求头中的authorization发给服务端进行权限认证
      options.headers.authorization = token;
  }
  options.headers['Content-Type'] = 'application/json';
  options.headers['Accept'] = 'application/json';
  options.method = options.method||'GET';
  options.credentials = "include";//跨域的时候要传递cookie 要跟服务器端配合起来用
  return fetch(BASE_URL+url,options).then(res=>res.json());
}