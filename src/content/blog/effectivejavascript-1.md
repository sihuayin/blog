---
title: "编写高质量JavaScript代码的68个有效方法 - 1"
description: "编写高质量JavaScript代码的68个有效方法"
pubDatetime: 2015-05-01
tags: ["javascript"]
---


## 第一章 让自己习惯JavaScript


#### 第一条 了解你使用的JavaScript版本 (-)

  JavaScript从发布以来，经历了多个版本。ES3, ES5, ES2015, ES2016...。 不同浏览器使用的js引擎对语言标准和特性实现的不一致也导致了，在编写js的代码的时候要考虑运行环境的问题。
  
  另外JavaScript已经不仅仅是运行在浏览器端，还能运行在服务器端，和客户端中。了解宿主对JavaScript的实现版本也变得重要。

  ES5 引用了一种版本控制的考量 - 严格模式(strict mode)。支持的js引擎可以识别出`'use strict'` 这个特定的字符串字面量。能够禁用js语言中的一些'糟粕',使得代码在严格模式下运行。而无法识别的引擎可以忽略，仍然按照既有的规则执行。如果一个文件file1.js 在严格模式行编写，而file2.js在非严格模式下编写。两个文件拼接以后可能出现问题：

  ```js
    // file1.js
    "use strict"
    function f(x) {}

    // file2.js
    function g() {
      var arguments = [] // error.严格模式下不可以给arguments赋值。
    }

  ```

  比较好的解决办法是使用立即执行函数(IIFE)包裹代码：
  ```js
  (function() {
    "use strict"
    function f() {}
  })();

  (function() {
    function g() {
      var arguments = [] // 非严格模式可以重新赋值， 但不应该如此
    }
  })();
  ```

  代码应该在严格模式下编写
  可以应自动模块化方式，使用IIFE将代码包裹起来

#### 第二条 理解JavaScript的浮点数

JavaScript只有一种数值类型(双精度浮点数)
```js
  typeof 17; // "number"
  typeof 98.6; // "number"
  typeof -2.1; // "number"
```

位运算比较特殊。将双精度浮点数转换成32位整数后进行运算。计算结果在转换成双精度浮点数。

警惕浮点数的计算，出了名的不精确:
```js
0.1 + 0.2; // 0.30000000000000004
```
浮点数计算不具有交换律的规则
```js
  (0.1 + 0.2) + 0.3 // 0.6000000000000001
  0.1 + (0.2 + 0.3) // 0.6
```

在精度范围允许的情况下，可以把浮点数 乘以 一个 10的倍数 进行整数计算， 在转换成浮点数.

#### 第三章： 当心隐式的强制转换

JavaScript对类型错误有一套尽量不抛出错误的做法, 这与很多语言不同，运用起来要多加注意
```js
 3 + true; // 4
```

 - 算数运算符 -, + , *, /, % 在计算前将参数转换成数字。
 - 运算法+ 比较微妙: 既重载了数字相加，又重载了字符串拼接。
 ```js
  2 + 3; // 5
  "hello" + " world" // hello world

  2 + "3";  // 23
  "2" + 3; // 23

  1 + 2 + "3"; // 33
  1 + "2" + 3 // 123
 ```
 - 位运算法和移位运算符(~, &, ^, |, >>, <<, >>>) 将参数强制转换成32位整数
 NaN的问题：测试一个值是否等于NaN，`x === NaN` 行不通；`isNaN()`不可靠，他将参数强制转换成数值：isNaN("foo")是ture，而不是false。好办法就是 它是唯一一个自己不等于自己的值
 ```js
  function isReallyNaN(x) {
    return x !== x
  }

 ```
 对象比较常见的会被强制转换成字符串
 ```js
  "the math object: " + Math; // "the math object: [object Math]"
  "the JSON object: " + JSON; // "the JSON object: [object JSON]"
 ```
 对象可以重写valueOf和toString两个函数，在强制转换成数值和字符串类型的时候使用
 ```js
  "J" + { toString: function() { return "S" }}; // JS
  2 * { valueOf: function() { return 3; }}; // 6
 ```

 当对象同时重写了toString和valueOf函数，在面对+运算的时候，会如何处理呢？
 答案是 盲目地选用valueOf方法而不是toString方法
 ```js
  var obj = {
    toString: function() {
      return "[object MyObject]"
    },
    valueOf: function() {
      return 17;
    }
  };
  "object: " + obj; // "object: 17"
 ```
 - if, ||, && 等运算符逻辑上需要布尔值作为操作参数，但实际上可以接受任何值。参数会被强制转换成真假值
 JavaScript中有7个假值: false, 0, -0, "", NaN. null, undefined。 其他值都是真值。
 使用真值运算检查函数参数或者对象属性是否已定义不是绝对安全的。例如：
 ```js
  function point(x, y) {
    if (!x) {
      x = 320
    }

    if (!y) {
      y = 240
    }
    return { x: x, y: y}
  }

  point(0, 0) // 得不到 {x: 0, y: 0 } 而是 { x: 320, y: 240 }

  // 需要更改为
    function point(x, y) {
    if (typeof x === 'undefined') {
      x = 320
    }

    if (y === undefined) {
      y = 240
    }
    return { x: x, y: y}
  }
 ```

 #### 第四章 原始类型优于封装对象
 如题

 #### 第五章 避免对混合类型使用 == 运算符
 ```js
 "1.0e0" == { valueOf: function() { return true; } }; // true
 ```
 | 参数1   |        参数2 | 强制转换 |
| -----:   | ----:       |  -----: |
|  null | undefined |  不转换，总是返回true |
|  null 或 undefined | 非 null和 undefined类型 |  不转换，总是返回false |
|  原始类型：string, number, boolean | Date 对象 |  将原始类型转换成数字；将Date转换成原始类型(先使用toString(), 然后使用valueOf()) |
|  原始类型：string, number, boolean | 非 Date对象 |  将原始类型转换成数字；将非Date转换成原始类型(valueIf(), toString()) |
|  原始类型：string, number, boolean | 原始类型：string, number, boolean |  将原始类型转换成数字；|

**注意Date对象和 非Date对象的强制转换过程 valueOf和toString调用顺序不同**

#### 第六章 了解分号插入的局限性

JavaScript提供了自动分号插入技术，它能推断出某些上下文中省略的分号，然后有效的自动将分号插入到程序中。
- 规则-：分号尽在 | 标记之前，一个或多个换行之后和程序输入的结尾被插入
- 规则二：分号仅在随后的输入标记不能解析时插入
```js
a = b
(f())

// ===
a = b(f())

a = b
["r", "g", "b"].forEach(function(key) {
  background[key] = foreground[key] / 2
})

// ===
a = b['b'].forEach(function(key) {
  background[key] = foreground[key] / 2
})

a = b
/Error/i.test(str) && fail()

// ===
a = b /Error / i.test(str) && fail()
```
立即执行函数 需要注意拼接时候的错误。办法是： 在前面添加';'
```js
// file1.js
;(function() {})()

// file2.js
;(function() {})()
```

return 语句需要把返回值写在同一行，不然即使添加; 也不行
类似的有 throw, break, continue ++, -- 参数之前不能换行
```js
  return 
  {};

  // 相当于
  return undefined;
  {};

````
- 规则三： 分号不会作为分隔符在for循环空语句的头部被自动插入

```js
for (var i = 0, total = 1 // 错误，不会自动添加分号
i < n
i++){
  total += 1
}
```

#### 第七条：视字符串为16位的代码单元序列

JavaScript使用16位编码, 在unicode 扩大访问到20位。字符串属性和方法(如length, charAt, charCodeAt)是基于代码单元层级，而不是代码点层级。
```js
 "𝄞 clef".length; // 7
 "G clef".length; // 6

 "𝄞 clef".charCodeAt(0); // 55348 (0xd834)
 "𝄞 clef".charCodeAt(1); // 56606 (0xdd1e)
 "𝄞 clef".charAt(1) === " "; // false
 "𝄞 clef".charAt(2) === ' '; // true

 /^.$/.test("𝄞") // false
 /^..$/.test("𝄞") // true
```
**使用第三方的库表写可识别代码点的字符串操作**