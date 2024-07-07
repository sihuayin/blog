---
title: "编写高质量JavaScript代码的68个有效方法 - 6"
description: "编写高质量JavaScript代码的68个有效方法"
publishDate: "2015-05-14"
tags: ["javascript"]
---


## 第六章 库和API设计

#### 第五十三条： 保持一致的约定

- 在变量命名和函数签名中使用一致的约定
- 不要偏离用户在他们开发平台中很可能遇到的约定

#### 第五十四条： 将undefined看做"没有值"

- 避免使用undefined表示任何非特定值
- 使用描述性的字符值或命名布尔属性的对象，而不要使用undefined或null来代表特定应用标志
- 提供参数默认值应当采用测试，undefined方式么人不是检查arguments.length
- 在允许0，NaN或空字符串为有效参数的地方，绝不哟啊通过真值测试来实现参数的默认值。

#### 第五十五条： 接收关键字参数的选项对象

```js
var alert = new Alert(100, 75, 300, 200, "error", message, "blue", "white", "black", "error", true)

// 改用选项对象的方式
var alert = new Alert({
  x: 100,
  y: 75,
  width: 300,
  height: 200,
  title: "error",
  message: message,
  titleColor: 'blue',
  bgCode: 'white',
  textColor: 'black',
  icon: 'error',
  modal: true
})
```

对象参数与类属性可以通过extend函数简化赋值操作

- 使用选线对象使得API更具有可读性，更容易记忆
- 所有通过选项对象提供的参数应当被视为可选项
- 使用extend函数抽象出从选项对象中提取值的逻辑

#### 第五十六条： 避免不必要的状态

- 尽可能地使用无状态的API
- 如果API是有状态的，标示出每个操作与哪些状态有关联。

#### 第五十七条： 使用结构类型设计灵活的接口

库设计功能的时候，需要抽象出接口，也被成为结构类型(structural typing)或鸭子类型(duck typing)，任何对象只要具有预期的结构就属于该类型，在JavaScript这种动态语言中，是一种优雅，特别轻量的编程模式。

你应该在API文档中可出对象接口的预期结构，

- 使用结构类型(鸭子类型)来设计灵活的对象接口
- 结构接口更灵活，更轻量，所以应该避免使用继承

#### 第五十八条：区分数组对象和类数组对象

ES5 以后使用Array.isArray
以前 toString.call(x) === '[object Array]'

#### 第五十九条： 避免过度的强制转换

- 避免强制转换和重载的混用
- 考虑防御编程性地见识非预期的输入

#### 第六十条 支持方法链

方法链可以减少中间变量使代码更加可读

- 使用方法连来连接无状态的操作
- 通过在无状态的方法中返回薪对象来支持方法链
- 通过哎有状态的方法中返回this来支持方法链


