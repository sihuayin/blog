---
title: "编写高质量JavaScript代码的68个有效方法 - 3"
description: "编写高质量JavaScript代码的68个有效方法"
publishDate: "2015-05-07"
tags: ["javascript"]
---


## 第三章 使用函数



#### 第十八条 理解函数调用,方法调用及结构函数调用之间的不同

- 最简单的使用模式是函数调用
```js
function hello(username) {
  return "hello, " + username
}

hello("Keyser Soze"); // "hello, Keyser Soze
```

- 方法调用.对象属性恰好是函数。
```js
var obj = {
  hello: () {
    return "hello, " + this.username
  },
  username: "Has Gruber"
}

obj.hello(); // "hello, Has Gruber"
```

this指向接收者.通过某个对象调用方法将查找改方法将该对象作为改方法的接收者。

```js
function hello() {
  return "hello, " + this.username
}

var obj1 = {
  hello: hello,
  username: 'shy'
}

obj1.hello() // 'hello, shy'

var obj2 = {
  hello: hello,
  username: 'ddd'
}
obj2.hello(); // "hello. ddd"

hello(); // "hello, undefined" 接收者为全局对象， 严格模式下会报错
```

- 通过构造函数调用
```js
function User(name, passwordHash) {
  this.name = name
  this.passwordHash = passwordHash
}

var u = new User("shy", '111')
u.name; // shy
```
构造函数调用将一个全新的对象作为this变量的值，并隐士返回这个薪对象作为调用结果。构造函数的主要职责是初始化该新对象。

#### 第十九条： 数量掌握高阶函数

标准库函数的 sort, map等
```js
// 1
var aIndex = "a".charCodeAt(0); // 97
var alphabet = ""
for (var i = 0; i < 26; i++) {
  alphabet += String.fromCharCode(aIndex + 1)
}
alphabet; // "abcdefghigklmnopqrstuvwxyz"

// 2
var digits = ""
for (var i = 0; i < 10; i++) {
  digits += i;
}
digits; "0123456789"

// 3
var random = ""
for (var i = 0; i < 8; i++) {
  random += String.fromCharCode(Math.floor(Math.random() * 26)) + aIndex)
}

random; // "bdwvfrtp"

// 改用高阶函数
function buildString(n, callback) {
  var result = ""
  for (var i = 0; i < n; i++) {
    result += callback(i)
  }
  return result
}

var alphabet = buildString(26, function(i) {
  String.fromCharCode(aIndex + i)
})

var digits = buildString(10, function(i) {
  return i
}) 

var random = buildString(8, function(i) {
  return String.fromCharCode(Math.floor(Math.random() * 26)) + aIndex)
})
```

#### 第二十条： 使用call方法自定义接收者来调用方法

灵活指定函数执行的接收者
```js
var table = {
  entries: [],
  addEntry: function(key, value) {
    this.entries.push({ key: key, value: value });
  },
  forEach: function(f, thisArg) {
    var entries = this.entries;

    for (var i = 0, n = entries.length; i < n; i++) {
      var entry = entries[i]

      f.call(thisArg, entry.key, entry.value, i)
    }
  }
}

table1.forEach(table2.addEntry, table2)
```

#### 第二十一条：使用apply方法通过不同数量的参数调用函数
有一个数组的参数，要传递给一个多参数的函数，apply比较容易做到
```js
function sum(a, b, c) {
  return a + b + c
}

var params = [1, 2, 3]
sum.apply(null, params)
```

#### 第二十二条：使用arguments创建课表参数的函数

任意数量number类型的数值求其平均值, 可以如下:
```js
function averageOfArray(a) {
  for (var i = 0, sum = 0, n = a.length; i < n; i++) {
    sum += a[i]
  }
  return sum / n
}
```
averageOfArray([2, 6, 7, 8, 10])

如果要支持任意参数，而不是一个数组作为参数呢？
```js
function average() {
  for (var i = 0, sum = 0, n = arguments.length; i < n; i++) {
    sum += arguments[i]
  }
  return sum / n
}

// 可以复用上面的实现
function average() {
  return averageOfArray(arguments)
}
```

#### 第二十三条： 永远不要修改arguments对象

- 永远不要修改arguments对象
- 使用[].slice.call(arguments)将arguments对象复制到一个真正的数组中在进行修改。

#### 第二十四条： 使用变量保存arguments的引用

如果函数中声明函数，那么arguments指向最近的一层函数，外层函数如果需要使用，需要赋值给变量进行保留。

#### 第二十五条： 使用bind方法提取具有确定接收者的方法

对象的方法传递给需要函数的高阶函数，丢失接收者

```js
var buffer = {
  entries: [],
  add: function(s) {
    this.entries.push(s)
  },
  concat: function() {
    return this.entries.join("")
  }
};

var source = ["867", "-", "5309"]
source.forEach(bufer.add); // error: entires is undefined
bufer.join()
````

forEach 支持 第二个参数传递接收者 `source.forEach(bufer.add, bufer)`

不支持传递接收者的情况下 可以：
```js
var source = ["867", "-", "5309"]
source.forEach(function(s) {
  bufer.add(s)
});
bufer.join()
```

内置的bind可以产生一个**新的带有接收者的函数**
```js
var source = ["867", "-", "5309"]
source.forEach(bufer.add.bind(buffer));
bufer.join()
```

#### 第26条：使用bind方法实现函数柯里化

比起显示的封装函数，函数柯里化是一种简洁的，使用更少引用来实现函数委托的方法。

```js
function simpleURL(protocol, domain, path) {
  retirn protocol + "://" + domain + "/" + path;
}

var urls = paths.map(function(path) {
  return simpleURL('http', siteDomain, path)
})

// bind柯里化
var urls = paths.map(simpleURL.bind(null, 'http', siteDomain))
```

#### 第二十七条： 使用闭包而不是字符串来封装代码

 - 当将字符串传递给eval函数以执行他们的API时，绝不要在字符串中包含局部变量引用
 - 接受函数调用的API优于使用eval函数执行字符串的api

#### 第二十八条： 不要依赖函数对象的toString方法

部分函数的toString可以打印处函数实现转换成字符串
```js
(function(x) {
  return x + 1;
}).toString();
// "function (x) {\n return x + 1;  \n}"
```
但很多时候不能。
所有不要相信函数的toString

#### 第29条：避免使用非标准的栈检查属性

在ES5的规范中 栈属性检查的几个(arguments, caller, callee)都不可使用

最好的策略是完全避免栈检查。如果检查栈的理由完全是为了调试，那么更为可靠的方式是使用交互式的调试器。
