export default function combineReducers(reducers){
   let reducerKeys = Object.keys(reducers);//[counter1,counter2]
   return function (state={},action){
      let hasChanged = false;//此次派发动作是否引起了状态的修改，或者说状态的改变
      const nextState = {};
      for(let i=0;i<reducerKeys.length;i++){
        const key = reducerKeys[i];//counter1
        const previousStateForKey = state[key];//{number:0}
        const reducer = reducers[key];//counter1
        let nextStateForKey = reducer(previousStateForKey,action);//{type:'ADD1'} {number:1}
        nextState[key] = nextStateForKey;
        hasChanged = hasChanged||nextStateForKey!==previousStateForKey;
      }
      return hasChanged?nextState:state;
   }
}