/**
 * 缓存代理的例子——计算乘积
 */

// 通过增加缓存代理的方式，mult 函数可以继续专注于自身的职责——计算乘积，缓存的功能是由代理对象实现的。
var mult = function(){ 
    console.log( '开始计算乘积' ); 
    var a = 1; 
    for ( var i = 0, l = arguments.length; i < l; i++ ){ 
        a = a * arguments[i]; 
    } 
    return a; 
};

// 当我们第二次调用 proxyMult( 1, 2, 3, 4 )的时候，本体 mult 函数并没有被计算，proxyMult直接返回了之前缓存好的计算结果。
var proxyMult = (function(){ 
    var cache = {}; 
    return function(){ 
        var args = Array.prototype.join.call( arguments, ',' ); 
        if ( args in cache ){ 
            return cache[ args ]; 
        } 
        return cache[ args ] = mult.apply( this, arguments ); 
    } 
})();

proxyMult( 1, 2, 3, 4 ); // 输出：24 
proxyMult( 1, 2, 3, 4 ); // 输出：24

/**
 * 用高阶函数动态创建代理
 * 通过传入高阶函数这种更加灵活的方式，可以为各种计算方法创建缓存代理。
 */

/**************** 计算乘积 *****************/ 
var mult = function(){ 
    var a = 1; 
    for ( var i = 0, l = arguments.length; i < l; i++ ){ 
        a = a * arguments[i]; 
    } 
    return a; 
}; 

/**************** 计算加和 *****************/ 
var plus = function(){ 
    var a = 0; 
    for ( var i = 0, l = arguments.length; i < l; i++ ){ 
        a = a + arguments[i]; 
    } 
    return a; 
}; 

/**************** 创建缓存代理的工厂 *****************/ 
var createProxyFactory = function( fn ){ 
    var cache = {}; 
    return function(){ 
        var args = Array.prototype.join.call( arguments, ',' ); 
        if ( args in cache ){ 
            return cache[ args ]; 
        } 
        return cache[ args ] = fn.apply( this, arguments ); 
    } 
}; 

var proxyMult = createProxyFactory( mult ), 
proxyPlus = createProxyFactory( plus );

console.log( proxyMult( 1, 2, 3, 4 ) ); // 输出：24 
console.log( proxyMult( 1, 2, 3, 4 ) ); // 输出：24 
console.log( proxyPlus( 1, 2, 3, 4 ) ); // 输出：10 
console.log( proxyPlus( 1, 2, 3, 4 ) ); // 输出：10
