/**
1.当派发动作的时候，要负责把新的状态持久化到存存储空间里去
2.可以从存储空间中加载初始化的数据并传给仓库
它是对reducer的增强
 */
export default function(persistConfig,reducer){
  let initilized = false;//是否已经初始化过，就是从local里拿到数据并且填充到仓库中
  let key = `persist:${persistConfig.key}`;
  let whitelist = persistConfig.whitelist;
  let blacklist = persistConfig.blacklist;
  return function(state,action){
      if(action.type === "PERSIST_INIT"){
            initilized = true;
            let value = persistConfig.storage.get(key);
            state = value?JSON.parse(value):undefined;
            return reducer(state,action);
      }
       if(action.type === "PERSIST_SAVE"){
            if(initilized){
               let savedState = {};
               if(whitelist){
                 for(let key in state){
                   if(whitelist.indexOf(key)!=-1){
                     savedState[key] = state[key]
                   }  
                 }
               }else if(blacklist){
                  for(let key in state){
                   if(blacklist.indexOf(key)==-1){
                     savedState[key] = state[key]
                   }  
                 }
               }
               
               persistConfig.storage.set(key,JSON.stringify(savedState));
               return state;
            }
      }
      return reducer(state,action);
  }
}