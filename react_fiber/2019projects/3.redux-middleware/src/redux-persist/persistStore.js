export default function(store){
    let persistor = {
        ...store,
        initilize(){
            store.dispatch({type:"PERSIST_INIT"});
        },
         save(){
            store.dispatch({type:"PERSIST_SAVE"});
        }
    }
    return persistor;
}