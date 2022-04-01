function Parent (name, age) {
  this.name = name;
  this.age = age;
}

Parent.prototype.doEat = function () {
  console.log(this.name + "吃饭...")
}

function Child (name, age, childName) {
  this.childName = childName
  Parent.call(this, name, age)
}


// 通用度比Object.create实现寄生组合继承模式更高，灵活度也更高
function _extends (parent, son) {//继承
  // 第一步: 创建一个寄生构造函数
  function Middle () {
    // this.count = 23
    this.constructor = son
  }

  Middle.prototype = parent.prototype
  // 第二步:创建一个寄生新创建的构造函数的对象
  let middle = new Middle();  //middle.__proto__=parent.prototype
  return middle
}

let middle = _extends(People, ChinesePeople);

// 第三步: 子类的原型对象空间指向  第二步的新创建的构造函数的对象
Child.prototype = middle


