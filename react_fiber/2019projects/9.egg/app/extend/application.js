// application.js app应用本身 应用缓存的东西
let data = {};
//exports=app
exports.cache = {
    get(key){
        return data[key];
    },
    set(key,value){
        data[key] = value;
    }
}