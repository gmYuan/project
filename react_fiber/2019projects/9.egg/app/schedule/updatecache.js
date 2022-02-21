const {Subscription} = require('egg');
class UpdateCacheSubscription extends Subscription{
  static get schedule(){
      return {
          interval:'5m',//每隔5分钟执行一次
          type:'all' //计划任务将在哪些worker上执行 all指的是在所有的worker上执行
      }
  }
  async subscribe(){
      const result = await this.ctx.curl(this.config.cache.url,{
          method:'GET',
          dataType:'json'
      });
      this.ctx.app.scheduleCache = result.data;
      //this.ctx.app.cache.title app代表egg.js应用的实例
  }
}
module.exports = UpdateCacheSubscription;