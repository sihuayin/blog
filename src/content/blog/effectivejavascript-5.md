---
title: "编写高质量JavaScript代码的68个有效方法 - 5"
description: "编写高质量JavaScript代码的68个有效方法"
pubDatetime: 2015-05-12
tags: ["javascript"]
---


## 第五章 数组和字典

直观地看，对象表示字符串与值映射的一个表格。
JavaScript支持继承(通过动态代理机制重用代码或数据)。但不是基于类，而是基于原型。
在许多语言中，每个对象是相关类的实例。该类提供在其所有实例间共享代码。JavaScript是从其他对象那里面继承。

#### 第四十三条： 使用Object的直接实例构造轻量级的字典

每个对象还继承了其原型对象中的属性，for in 循环除了枚举出对象“自身”的属性外，还会枚举出继承过来的属性。
```js
function NaiveDict() {}

NaiveDict.prototype.count = function() {
  var i = 0
  for (var name in this) {
    i++
  }
  return i
}
NaiveDict.prototype.toString = function() {
  return "[object NavieDict]"
}

var dict = new NaiveDict()

dict.alice = 34
dict.bob = 24
dict.chris = 62
dict.count(); // 5 count, toString, alice, bob, chris
```

如此便造成了原型污染(当枚举字典的条目时， 原型对象中的属性可能会导致出现一些不期望的属性)

改用数组也有问题
```js
var dict = new Array()

dict.alice = 34
dict.bob = 24
dict.chris = 62

dict.bob // 24

Array.prototype.first = function() {
  return this[0]
}

Array.prototype.last = function() {
  return this[this.length - 1]
}

for (var name in dict) {
  console.log(name)
}
// alice bob chris first last
```

所以轻量级字典应该是Obejct.prototype 的直接子类，以使for..in循环免受原型污染。

#### 第四十四条： 使用null原型以防止原型污染

```js
var x = Object.create(null)
Object.getPrototypeOf(x) === null // true
```
原型污染无法影响这样的对象行为

#### 第四十五条： 使用hasOwnProperty方法以避免原型污染

hasOwnProperty可以避免原型污染

```js
var dict = {}

'toString' in dict; //true

dict.hasOwnProperty("toString") // false
```

如果对象的hasOwnProperty被重写或删除， 可以改用call的方式
```js
{}.hasOwnProperty.call(dict, "toString") // false
```

定义一个比较晚上的字典类型，并排除__proto__的影响
```js
function Dict(elements) {
  this.elements = elements || {}
  this.hasSpecialProto = false
  this.specialProto = undefined
}

Dict.prototype.has = function(key) {
  if (key === "__proto__") {
    return this.hasSpecialProto
  }
  return ({}).hasOwnProperty.call(this.elements, key)
}

Dict.prototype.get = function(key) {
  if (key === "__proto__") {
    return this.specialProto
  }

  return this.has(key) ? this.elements[key]: undefined
}

Dict.prototype.set = functiopn(key, val) {
  if (key === "__proto__") {
    this.hasSpecialProto = true
    this.specialProto = val
  } else {
    this.elements[key] = val
  }
}

Dict.prototype.remoove = function(key) {
  if (key === "__proto__") {
    this.hasSpecialProto = fa;se
    this.specialProto = undefined
  } else {
    delete this.elements[key]
  }
}
```

#### 第四十六条： 使用数组而不要使用字典来存储有序集合

- 使用for..in循环来枚举对象属性应当与顺序无关
- 如果聚集运算字典中的数据，确保聚集操作与顺序无关
- 使用数组而不是字典来存储有序集合

#### 第四十七条： 绝不要在Object.prototype中添加可枚举的属性

由于存在原型污染。
- 最好不要给Object.prototype添加属性
- 可以改用函数的方式实现，而不是给Object.prototype添加属性
- 使用Object.defineProperty来添加

```js
Object.definedProperty(Object.prototype, "allKeys", {
  value: function() {
    var result = []
    for (var key in this) {
      result.push(key)
    }
    return result
  },
  writable: true,
  enumerable: false,
  configurable: true
})
```

#### 第四十八条： 避免在枚举期间修改对象

- 当使用for..in循环枚举一个对象属性时， 确保不要修改该对象
- 当迭代一个对象时，如果该对象的内容可能会在循环期间被修改，应该使用while循环或经典的for循环来代替for..in循环
- 为了在不断变化的数据结构中能够预测枚举，考虑使用一个有序的数据结构，例如数组， 而不是使用字典对象

#### 第四十九条： 数据组迭代要优先使用for循环而不是for..in循环

错误的代码
```js
var scores = [98, 74, 85, 77, 93, 100, 89]
var total = 0
for (var score in scores) {
  total += score
}

var mean = total / scores.length
mean; ?
```
mean结果是： 17636.571428571428

正确程序应该是：
```js
var scores = [98, 74, 85, 77, 93, 100, 89]
var total = 0
for (var i = 0, n = scores.length; i < n; i++) {
  total += scores[i]
}

var mean = total / scores.length
```

#### 第五十条： 迭代方法优于循环

尽量使用forEach, map, filter等代替for
forEach如何退出呢？

```js
function taleWhile(a, pred) {
  var result = []
  a.forEach(function(x, i) {
    if (!pred(x)) {
      // ？
    }
    result[i] = x
  })
  return result
}
```

抛异常的方式
```js
function taleWhile(a, pred) {
  var result = []
  var earlyExit = {}
  try {
     a.forEach(function(x, i) {
      if (!pred(x)) {
        throw earlyExit
      }
      result[i] = x
    })
  } catch (e) {
    if (e !== earlyExit) {
      throw e
    }
  }
 
  return result
}

```

使用every

```js
function taleWhile(a, pred) {
  var result = []
  a.every(function(x, i) {
    if (!pred(x)) {
      return false
    }

    result[i] = x
    return true
  })
 
  return result
}
```

#### 第五十一条： 在类数组对象上复用通用的数组方法

- 对于类数组对象，通过提取方法对象并使用其call方法来复用通用的Array方法
- 任意一个具有索引属性和恰当length属性的对象都可以使用通用的Array方法

#### 第五十二条： 数组字面量优于数组构造函数

如题
