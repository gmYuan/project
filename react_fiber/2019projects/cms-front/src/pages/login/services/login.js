import request from '../../../utils/request';
//这是我们的注册的功能
export function signup(user){
  return request(`/api/signup`,{
      method:'POST',
      body:JSON.stringify(user)
  });
}
export function signin(user){
  return request(`/api/signin`,{
      method:'POST',
      body:JSON.stringify(user)
  });
}