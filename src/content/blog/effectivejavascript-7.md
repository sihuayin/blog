---
title: "编写高质量JavaScript代码的68个有效方法 - 7"
description: "编写高质量JavaScript代码的68个有效方法"
pubDatetime: 2015-05-16
tags: ["javascript"]
---


## 第七章 并发

通过一个简单的模型(事件队列或事件循环并发)和异步的API简化了并发场景复杂度

#### 第六十一条： 不要阻塞I/O事件队列

JavaScript并发的一个最重要的规则是绝不要在应用程序事件队列中使用阻塞I/O的API，在浏览器中，一个阻塞事件处理程序会阻塞任何将被处理的其他用户输入，甚至可能阻塞一个页面的渲染，从而导致页面失去响应的用户体验。在服务器端，一个阻塞事件处理程序可能会阻塞将被处理的其他网络请求，从而导致服务失去响应。

- 异步API使用回调函数来延缓吹代价高昂的操作以避免阻塞主应用程序
- JavaScript并发地接收事件，但会使用一个事件队列按序地处理事件处理程序
- 在应用程序事件队列中绝不要使用阻塞的I/O

#### 第六十二条： 在异步序列中使用嵌套或命名的回调函数

- 使用嵌套或命名的回调函数按顺序地执行多个异步操作
- 尝试在过多的嵌套的回调函数和尴尬的命名的非嵌套回调函数之间取得平衡
- 避免将可被并行执行的操作顺序化

#### 第六十三条： 当心丢失错误

管理异步编程的一个比较困哪的芳年是对错误的处理。

无法使用try..catch

- 通过编写共享的错误处理函数来避免复制和剪贴错误处理代码
- 确保明确地处理所有的错误条件以避免丢失错误

#### 第六十四条： 对异步循环使用递归

有一个函数接收一个url的数组并尝试一次下载每个文件直到有一个文件被下载成功

```js
function downloadOneAsync(urls, onsuccess, onfailure) {
  var n = urls.length

  function tryNextURL(i) {
    if (i >= n) {
      onfailure("all download failled")
      return
    }
    downloadAsync(urls[i], onsuccess, functon() {
      tryNextURL(i + 1)
    })
  }

  tryNextURL(0)
}
```

- 循环是不能异步的
- 使用递归数在事件循环的单独轮次中执行迭代
- 在事件循环的单独轮次中执行递归，并不会导致调用栈溢出

#### 第六十五条： 不要在计算时阻塞事件队列

- 避免在主事件队列中执行代价高昂的算法
- 在支持Workler API的平台，该API可以用来在一个独立的事件队列中运行长计算程序
- 在worker API不可用或者代价昂贵的环境中，考虑将计算程序分解到事件循环的多个轮次中。

#### 第六十六条： 使用计算器来执行并行操作

给定一个url数组，并行下载url的内容，并保持与原数组的顺序关系：
```js
function downloadAllAsync(urls, onsuccess, onerror) {
  var pending = urls.length
  var result = []

  if (pending === 0) {
    setTimeout(onsuccess.bind(null, result), 0)
    return 
  }

  urls.forEach(function(url, i) {
    downloadAsync(url, function(text) {
      if (result) {
        result[i] = text
        pending--

        if (pending === 0) {
          onsuccess(result)
        }
      }
    }, function(error) {
      if (result) {
        resukt = null
        onerror(error)
      }
    })
  })
}
```

- JavaScript应用程序中的事件发生是不确定的，即顺序是不可预测的。
- 使用计数器避免并行操作中的数据竞争

#### 第六十七条： 绝不要同步地调用异步的回调函数

// 错误代码
```js
var cache = new Dict()

function downloadCachingAsync(url, onsuccess, onerror) {
  if (cache.has(url)) {
    onsuccess(cache.get(url))
    return
  }
  return downloadAsync(url, function(file) {
    cache.set(url, file)
    onsuccess(file)
  }, onerror)
}
```
downloadCachingAsync函数在cache存在的情况下，变成了同步返回，如此就造成流程上的错乱。

应该改成
```js
var cache = new Dict()

function downloadCachingAsync(url, onsuccess, onerror) {
  if (cache.has(url)) {
    var cached = cache.get(url)
    setTimeout(onsuccess.bind(null,cached), 0)
    return
  }
  return downloadAsync(url, function(file) {
    cache.set(url, file)
    onsuccess(file)
  }, onerror)
}

```

- 即使可以立即得到数据，也绝不要同步地调用异步回调函数
- 同步地调佣异步的回调函数扰乱了预期的操作序列，并可能导致意想不到的交错代码
- 同步地调用异步的回调函数可能导致栈溢出或者错误地处理异常

#### 第六十八条： 使用promise模式清洁异步逻辑

- promise代表最终值，即并行操作完成时最终产生的结果
- 使用promise组合不同的并行操作
- 使用promise模式的API避免数据竞争
- 在要求有意的竞争条件时使用select(也被成为choose， race)
