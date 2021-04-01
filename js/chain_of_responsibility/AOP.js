/**
 * 用 AOP 实现职责链
 */

/*
    在之前的职责链实现中，我们利用了一个 Chain 类来把普通函数包装成职责链的节点。
    其实利用 JavaScript 的函数式特性，有一种更加方便的方法来创建职责链。

    下面我们改写一下 closure_and_higherOrderFn/index.js 内的 Function.prototype.after 函数，
    使得第一个函数返回'nextSuccessor'时，将请求继续传递给下一个函数，
    无论是返回字符串'nextSuccessor'或者 false 都只是一个约定，
    当然在这里我们也可以让函数返回 false 表示传递请求，选择'nextSuccessor'字符串是因为它看起来更能表达我们的目的，代码如下：
 */

Function.prototype.after = function( fn ){ 
    var self = this; 
    return function(){ 
        var ret = self.apply( this, arguments ); 
        if ( ret === 'nextSuccessor' ){ 
            return fn.apply( this, arguments ); 
        } 

        return ret; 
    } 
}; 

var order = order500yuan.after( order200yuan ).after( orderNormal ); 

order( 1, true, 500 ); // 输出：500 元定金预购，得到 100 优惠券
order( 2, true, 500 ); // 输出：200 元定金预购，得到 50 优惠券
order( 1, false, 500 ); // 输出：普通购买，无优惠券

/*
    用 AOP 来实现职责链既简单又巧妙，但这种把函数叠在一起的方式，同时也叠加了函数的作用域，如果链条太长的话，也会对性能有较大的影响。
 */