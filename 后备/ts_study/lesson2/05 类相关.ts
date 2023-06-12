//exports.__esModule = true;
export {}

// 1 定义存取器 + 参数属性
class User{
    //myName:string;
    constructor(public myName:string){
        //this.myName = myName
    }
    get name(){
        return this.myName;
    }
    set name(value){
        this.myName = value;
    }
}
let user = new User('zhufeng');
user.name = 'jiagou';
console.log(user.name);
//参数属性：public / readonly /protected / private 


//例2  readonly
class Animal{
    public readonly name:string;
    constructor(name:string){
        this.name = name;
    }
    changeName(name: string){
        //this.name = name;
    }
}


//例3  public /private / protected 关系 + 静态属性方法
class Father {
    static fatherName: string = 'fatherName';

    toString(){
        console.log('Father');
    }

    public name: string;        // public 自己 自己的子类 和其它类都能访问
    protected age: number;  // protected 自己和自己子类能访问,其它类不能访问
    private money: number;  // private 自己能访问,子类和其它类不能访问
    constructor(name: string, age: number, money:number) {
        this.name = name;
        this.age = age;
        this.money = money;
    }
    getName(): string {
        return this.name;
    }
}


class Child extends Father {
    static childName: string = 'childName';

    constructor(name: string, age: number, money: number) {
        super(name, age,money);
    }

    public toString() {
        // 调用父类方法
        super.toString();
        console.log('Child');
    }

    public desc(){
        console.log(this.name,this.age);
    }
}

//动物 哺乳动物
let father = new Father('zhufeng', 11, 1);
//father.toString()
let child = new Child('zhufeng',11,1);
child.toString()

//Child.fatherName;
//Child.childName;
//child.age;
//child.money;
