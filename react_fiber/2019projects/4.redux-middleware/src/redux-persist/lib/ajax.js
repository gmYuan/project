let storage = {
 async get(key){
  set(key,value){
    await fetch(`/${key}`,{
        method:'POST',
        body:JSON.stringify(value)
    });
 },
 async get(key){
     let result = await fetch(`/${key}`).then(res=>res.json());
     return result;
 }
}
export default storage;