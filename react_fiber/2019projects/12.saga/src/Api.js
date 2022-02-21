export default {
    login(user){
        return new Promise(function(resolve,reject){
            setTimeout(() => {
                Math.random()>.5?resolve(user.name):reject('登录失败');
            }, 2000);
        });
    }
}