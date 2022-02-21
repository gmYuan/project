import request from '../../../../utils/request';
import qs from 'querystring';
const ENTITY = 'user';
//这是我们的注册的功能
export function fetch(pageNum,where){
  let whereString = qs.stringify(where);
  return request(`/api/${ENTITY}?pageNum=${pageNum}&${whereString}`);
}
export function create(values){
 return request(`/api/${ENTITY}`,{
   method:"POST",
   body:JSON.stringify(values)
 });
}
export function update(values){
 return request(`/api/${ENTITY}/${values.id}`,{
   method:"PUT",
   body:JSON.stringify(values)
 });
}
export function del(id){
 return request(`/api/${ENTITY}/${id}`,{
   method:"DELETE"
 });
}
export function delAll(ids){
 return request(`/api/${ENTITY}/${ids[0]}`,{
   method:"DELETE",
   body:JSON.stringify(ids)
 });
}