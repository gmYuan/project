function loader(source) {
  //console.log('this.name',this.name);
  console.log("post1");
  return source + "//post1";
}
loader.pitch = function () {
  console.log("loder内部--- post1-pitch执行了");
};
module.exports = loader;
