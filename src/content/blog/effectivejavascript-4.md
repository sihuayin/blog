---
title: "编写高质量JavaScript代码的68个有效方法 - 4"
description: "编写高质量JavaScript代码的68个有效方法"
pubDatetime: 2015-05-10
tags: ["javascript"]
---


## 第四章 对象和原型

直观地看，对象表示字符串与值映射的一个表格。
JavaScript支持继承(通过动态代理机制重用代码或数据)。但不是基于类，而是基于原型。
在许多语言中，每个对象是相关类的实例。该类提供在其所有实例间共享代码。JavaScript是从其他对象那里面继承。

#### 第三十条 理解prototype,getPrototype和__props__之间的不同
- C.prototype用于建立由new C()创建的对象的原型
- Object.getProtoptype(obj)es5中用来获取对象obj原型对象的标准方法
- obj.__proto__ 是获取obj原型对象的非标准方法

```js
function User(name, passwordHash) {
  this.name = name
  this.passwordHash = passwordHash
}

User.prototype.toString = function() {
  return "[User ]" + this.name + "]";
}

User.prototype.checkPassword = function(password) {
  return hash(password) === this.passwordHash
}

var u = new User('sh', '1232')
```

User.prototype 本是个空对象，添加了两个函数 `toString`, `checkPassword`.
使用new 实例化出来u以后， u得到自动分配的原型对象User.prototype

Obejct.getPrototypeOf(u) === User.prototype // true

u.__proto__ === User.prototype // true

#### 第三十一条： 使用Ojbect.getPrototypeOf函数而不要使用__proto__属性

如题

#### 第三十二条： 始终不要修改__proto__属性

__proto__属性很特殊。它提供了Object.getPrototypeOf()不具备的能力。修改对象原型链接的能力.

- 造成代码不可移植
- 性能问题。造成很多优化失效
- 是的功能变得不可预测

#### 第三十三条： 使构造函数与new操作符无关

构造函数在不使用new来调用时候，this将变成全局对象，造成很多问题。
```js
function User(name, passwordHash) {
  this.name = name
  this.passwordHash = passwordHash
}

var u = User('shy', '111')
u; // undefined
name; // shy
```
如果两种方式都支持， 则可以修改成：
```js
function User(name, passwordHash) {
  var self = this instanceof User
    ? this
    : Object.create(User.prototype)
  self.name = name
  self.passwordHash = passwordHash

  return self
}
```

#### 第三十四条： 在原型中存储方法

不使用原型继承同样可以完成上述对象功能
```js
function User(name, passwordHash) {
  this.name = name
  this.passwordHash = passwordHash
  this.toString = function() {
    return "[User ]" + this.name + "]";
  }
  this.checkPassword = function(password) {
    return hash(password) === this.passwordHash
  }
}

var u = new User('sh', '1232')
```
但如果多次调用new User() 会重复产生多个实例，具有相同的toStirng()和checkPassword()造成内存的浪费，也无法利利用引擎对原型方法的优化手段。

#### 第三十五条： 利用闭包存储私有数据

JavaScript对象系统并没有特别鼓励隐藏属性。很多时候依靠规范和命名来约束团队不要更改私有的属性。如果要做到真正的隐藏需要使用闭包

```js
function User(name, passwordHash) {
  this.toString = function() {
    return "[User: " + name + "]"
  }

  this.checkPassword = function(password) {
    return hash(password) === passwordHash
  }
}

var u = new User('shy', '111')
```
对象u无法直接访问到name。
该模式的缺点是： 为了让构造函数中的变量咋已使用它们的方法的作用域内，这些方法必须置于实例对象中。

#### 第三十六条： 只将实例状态存储在实例对象中

原型链上的对象如果贡献。每个实例的更改都会对它造成影响。所以不是共享的状态需要保存在实例属性中。

#### 第三十七条： 认识到this变量的隐式绑定问题

读取csv的一个程序：
```js
function CSVReader(separators) {
  this.separators = separators || [',']

  this.regexp = new RegExp(this.separators.map(function(sep) {
    return "\\" + sep[0]
  })).join('|')
}

CSVReader.prototype.read = function() {
  var lines = str.trim().split(/\n/);

  return lines.map(function(line) {
    return line.split(this.regexp) // 错误的this指向
  })
}
```

map支持第二个参数来指代this
```js
 return lines.map(function(line) {
    return line.split(this.regexp) // 错误的this指向
  }, this)
```

用变量保存
```js
CSVReader.prototype.read = function() {
  var lines = str.trim().split(/\n/);
  var self = this

  return lines.map(function(line) {
    return line.split(self.regexp) // 错误的this指向
  })
}
```

使用bind产生薪的函数
```js
CSVReader.prototype.read = function() {
  var lines = str.trim().split(/\n/);

  return lines.map(function(line) {
    return line.split(this.regexp) // 错误的this指向
  }.bind(this))
}
```

#### 第三十八条： 在子类的构造函数中调用父类的构造函数

- 在子类构造函数中显示地传递this作为显式地接收者调用父类构造函数
- 使用Object.create函数来构造子类的原型对象以避免代用父类的构造函数。

#### 第三十九条： 不要重用父类的属性名

如题

#### 第四十条： 避免继承标准类

- 继承标准类往往会由于一些特殊的内部属性(如[[Class]])而被破坏
- 使用属性委托优于继承标准类

#### 第四十一条： 将原型视为实现细节

- 对象是接口，原型是实现
- 避免检查你无法控制的对象的原型结构
- 避免检查实现在你无法控制的对象内部的属性。

#### 第四十二条： 避免使用轻率的猴子补丁

- 避免使用轻率的猴子补丁
- 记录程序库所执行的所有猴子补丁
- 考虑通过将修改置于一个到处函数中，使猴子补丁成为可选项
- 使用猴子补丁为缺失的标准API提供polyfills

