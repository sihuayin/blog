---
title: "编写高质量JavaScript代码的68个有效方法 - 2"
description: "编写高质量JavaScript代码的68个有效方法"
publishDate: "2015-05-03"
tags: ["javascript"]
---


## 第二章 变量作用域


#### 第八条 尽量少用全局变量

定义全局变量会污染共享的公共命名空间，并可能导致意外的命名冲突。全局变量不利于模块化，因为它会导致程序中独立组件间不必要的耦合。
```js
var i, n, sum; // 全局变量
function averageScore(player) {
  sum = 0
  for (i = 0, n = player.length; i < n;i++) {
    sum += player.levels[i].score
  }
  return sum
}

// 避免使用全局变量改成
function averageScore(player) {
  var i, n, sum;
  sum = 0
  for (i = 0, n = player.length; i < n;i++) {
    sum += player.levels[i].score
  }
  return sum
```

全局作用域下的this和产生全局变量
```js
this.foo
foo = "global"
this.foo // "global"
```
全局变量提供了一种，可以检测平台对某些特性的支持。比如是否支持JSON
```js
if (!this.JSON) {
  this.JSON = {
    parse: function() {},
    strinify: function() {}
  }
}
```

#### 第九条 始终声明局部变量

给未声明的变量赋值，不会导致错误，而是产生一个全局变量：
```js
function swap(a, i, j) {
  temp = a[i]
  a[i] = a[j]
  a[j]= temp
}

// 用var声明，就不会产生全局变量
function swap(a, i, j) {
  var temp = a[i]
  a[i] = a[j]
  a[j]= temp
}
```
#### 第十条： 避免使用with
相比较with带来的便捷也它产生的问题，不适用with是比较好的选择

#### 第十一章 熟练掌握闭包
三个基本事实：
- JavaScript允许你引用在当前函数以外定义的变量
```js
function makeSandwich() {
  var magicIngredient = "peanut butter"
  function make(filling) {
    return magicIngredient + " and " + filling // magicIngredient外部定义
  }
  return make("jelly")
}

makeSandwich() // peanut butter and jelly
```

- 即使外部函数已经返回，当前函数仍然可以引用在外部函数所定义的变量。
```js
function makeSandwich() {
  var magicIngredient = "peanut butter"
  function make(filling) {
    return magicIngredient + " and " + filling // magicIngredient外部定义
  }
  return make
}
var f= makeSandwich() // magicIngredient已经释放
f('jelly') // peanut butter and jelly 仍然保留一个引用在闭包环境下
```

更为方便的声明闭包的方式
```js
function sandWithMaker(magicIngredient) {
  return function(filling) {
    return magicIngredient + " and " + filling
  }
}
```

- 闭包可以更新外部变量的值 (闭包存储的是外部变量的引用，而不是他们的值的副本)
```js
function box() {
  var val = undefined
  return {
    set: function(newVal) { val = newVal; },
    get: functon() { return val; },
    tyep: function() { return typeof val; }
  }
}

var b = box()
b.type() // undefined
b.set(98.6)
b.get() // 98.6
b.type() // number
```

#### 第十二条： 理解变量声明提升

JavaScript支持词法作用域，但不支持块级作用域，即变量定义的作用域不是离其最近的封闭语句或代码块，而是包含他们的函数。
```js
function isWinner(player, others) {
  var highset = 0;
  for (var i = 0, n = others.length; i < n; i++) {
    var player = others[i]
    if (player.score > highset) {
      highset = player.score
    }
  }
  return player.score > highset  // 此时的player是others的最后一个， 而不是参数player
}
```
没有块级作用域的例外是try-catch。捕获异常绑定到一个变量，改变量的作用域只是catch语句块

```js
function test() {
  var x = 'var', result = [];
  result.push(x)
  try {
    throw new Error ("Exception")
  } catch (x) {
    x = "catch"
  }
  result.push(x)
  return result
}

test(); // ["var", "var"]
```

#### 第十三条：使用立即调用的函数表达式创建局部作用域

这段程序(bug程序)的输出是什么?
```js
function wrapElements(a) {
  var result = [], i, n;
  for (i = 0, n = a.length; i < n; i++) {
    result[i] = function() { return a[i]; };
  }
  return result;
}

var wrapped = wrapElements([10, 20, 30, 40, 50])
var f = wrapped[0]
f(); // ?
```
可能期望是 10， 而答案是undefined
**理解绑定和赋值的区别**

解决办法是通过创建一个嵌套函数并立即调用它来强制创建一个局部的作用域
```js
function wrapElements(a) {
  var result = [], i, n;
  for (i = 0, n = a.length; i < n; i++) {
    (function() {
      var j = i 
      result[] = function() { return a[j]; };
    })
  }
  return result;
}
```
**如此做的话要小心： 不能在立即执行函数里面调用 continue， break; this和argument也变得不同。**

#### 第十四条： 当心命名函数表达式笨拙的作用域

```js
// 命名函数表达式
function double(x) { return x * 2; }

// 表达式
var f= function double(x) { return x * 2; }
```
表达式的方式将函数赋值给了f 而不是double， doule仅函数内部可用。
命名函数可以在调用栈中显示出函数名称。

#### 当心局部块函数声明笨拙的作用域
```js
function f() { return "global"; }

function test(x) {
  var result = []
  if (x) {
    function f() { return 'local'; }
    result.push(f())
  }
  result.push(f())
  return result
}

test(true) // ?
test(false) // ?
```

因为没有块级作用域，函数的重复声明会覆盖。有的浏览器会输出
['local', 'local']
['local']

而函数定义在if语句中，可能并没有覆盖，有的浏览器就不会覆盖.
官方指定函数声明只能出现在其他函数或者程序最外层。
如果一定要如此执行，可以改写成： 

```js
function f() { return "global"; }

function test(x) {
  var g = f;
  var result = []
  if (x) {
    g = function() { return 'local'; }
    result.push(g())
  }
  result.push(g())
  return result
}

test(true) // ?
test(false) // ?
```

#### 第十六条： 避免使用eval创建局部变量

错误使用eval函数的最简单的方式之一就是允许它干扰作用域

```js
function test(x) {
  eval("var y = x;");
  return y
}

test("hello"); // "hello"
```

只有当eval被执行时， 影响才会发生
```js
var y = "global";
function test(x) {
  if (x) {
    eval("var y = 'local';");
  }
  return y
}

test(true); // "local"
test(false); // "global"
``` 
但是无限制的执行eval是不安全的。保证eval函数不影响外部作用域的一个简单方法是在一个明确的嵌套作用域中运行它。

```js
var y = "global"
function test(src) {
  (function() { eval(src); })()
  return y
}

test("var y = 'local';") // "global"
test("var z = 'local';") // "global"
```

#### 第十七条： 间接调用eval函数优于直接调用

直接调用eval
```js
var x = "global"
function test() {
  var x = 'local'
  return eval('x')
}

test(); // local
```

间接调用 - 在全局作用域中执行
```js
var x = "global"
function test() {
  var x = 'local'
  return (0, eval)('x')
}

test(); // global
````