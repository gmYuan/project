const {Service} = require('egg');
let BaseService = require('./base');
class RoleService extends BaseService{
  constructor(...args){
      super(...args);
      this.entity = 'role';
  }
   async select(pageNum,pageSize,where){
     let whereString = ' ';
     let fields = Object.keys(where);//[username,email]
     for(let i=0;i<fields.length;i++){
          whereString += (`AND ${fields[i]} like '%${where[fields[i]]}%'`)
     }
     let listSQL = `SELECT * FROM ${this.entity} where 1=1 ${whereString} order by id DESC limit ${(pageNum-1)*pageSize},${pageSize}`;
     let list = await this.app.mysql.query(listSQL);
     for(let i=0;i<list.length;i++){
       let role = list[i];
       //select * from role_resource where role_id = role.id
       let role_resources = await this.app.mysql.select('role_resource',{where:{role_id:role.id}});
       let resourceIds  = role_resources.map(role_resource=>role_resource.resource_id);
       role.resourceIds=resourceIds;

       let role_users = await this.app.mysql.select('role_user',{where:{role_id:role.id}});
       let userIds  = role_users.map(role_user=>role_user.user_id);
       role.userIds=userIds;
     }
     let countSQL = `SELECT COUNT(*) total FROM ${this.entity} WHERE 1=1 ${whereString}`;
     let result =await this.app.mysql.query(countSQL);
     return {list,total:result[0].total};
   }
  async getUser(){
    const {app,service,ctx} = this;
    let result = await app.mysql.select('user');
    return result;
  }
  async setUser(body){//{roleId:1,userIds:[2,3]}
    const {app,service,ctx} = this;
    const {roleId,userIds} = body;
    const conn = await app.mysql.beginTransaction();
    let success=true;
    try{
      await conn.query(`DELETE FROM role_user WHERE role_id = ?`,[roleId]);//删除此角色关系的所有用户
      for(let i=0;i<userIds.length;i++){
        await conn.insert('role_user',{'role_id':roleId,'user_id':userIds[i]});
      }
      await conn.commit();
    }catch(error){
      await conn.rollback();
      success =false;
    }
    return success;
  }
  async getResource(){
    const {app,service,ctx} = this;
    let list = await app.mysql.select('resource');
    let rootMenus = [];
    let resourceMap = {};
    list.forEach(item=>{
      item.children = [];
      resourceMap[item.id] = item;
      if(item.parent_id === 0){//如果父ID是为0表示这个资源是一个顶级资源
        rootMenus.push(item);
      }else{
        resourceMap[item.parent_id]&&resourceMap[item.parent_id].children.push(item);
      }
    });
    return rootMenus;
  }
  async setResource(body){//{roleId:1,resourceIds:[2,3]}
    const {app,service,ctx} = this;
    const {roleId,resourceIds} = body;
    const conn = await app.mysql.beginTransaction();
    let success=true;
    try{
      await conn.query(`DELETE FROM role_resource WHERE role_id = ?`,[roleId]);//删除此角色关系的所有资源
      for(let i=0;i<resourceIds.length;i++){
        await conn.insert('role_resource',{'role_id':roleId,'resource_id':resourceIds[i]});
      }
      await conn.commit();
    }catch(error){
      await conn.rollback();
      success =false;
    }
    return success;
  }
}
module.exports = RoleService;