/**
 * 迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。
 */

/*
    内部迭代器
    内部迭代器在调用的时候非常方便，外界不用关心迭代器内部的实现，跟迭代器的交互也仅仅是一次初始调用，但这也刚好是内部迭代器的缺点。
    由于内部迭代器的迭代规则已经被提前规定，each 函数就无法同时迭代 2 个数组了。
 */

// 自己实现一个 each 函数，each 函数接受 2 个参数，第一个为被循环的数组，第二个为循环中的每一步后将被触发的回调函数
var each = function( ary, callback ){ 
    for ( var i = 0, l = ary.length; i < l; i++ ){ 
        callback.call( ary[i], i, ary[ i ] ); // 把下标和元素当作参数传给 callback 函数
    } 
}; 

each( [ 1, 2, 3 ], function( i, n ){ 
    console.log( [ i, n ] ); 
});

/*
    外部迭代器
    外部迭代器必须显式地请求迭代下一个元素。
    外部迭代器增加了一些调用的复杂度，但相对也增强了迭代器的灵活性，我们可以手工控制迭代的过程或者顺序。
 */

var Iterator = function( obj ){ 
    var current = 0; 

    var next = function(){ 
        current += 1; 
    }; 

    var isDone = function(){ 
        return current >= obj.length; 
    }; 

    var getCurrItem = function(){ 
        return obj[ current ]; 
    }; 

    return { 
        next: next, 
        isDone: isDone, 
        getCurrItem: getCurrItem 
    } 
};

/*
    迭代类数组对象和字面量对象
 */

// jQuery 中提供了 $.each 函数来封装各种迭代行为
$.each = function( obj, callback ) { 
    var value, 
    i = 0, 
    length = obj.length, 
    isArray = isArraylike( obj ); 
    if ( isArray ) { // 迭代类数组
        for ( ; i < length; i++ ) { 
            value = callback.call( obj[ i ], i, obj[ i ] ); 
            if ( value === false ) { 
                break; 
            } 
        } 
    } else { 
        for ( i in obj ) { // 迭代 object 对象
            value = callback.call( obj[ i ], i, obj[ i ] ); 
            if ( value === false ) { 
                break; 
            } 
        } 
    } 
    return obj; 
};

/*
    倒序迭代器
 */
var reverseEach = function( ary, callback ){ 
    for ( var l = ary.length - 1; l >= 0; l-- ){ 
        callback( l, ary[ l ] ); 
    }
}; 

reverseEach( [ 0, 1, 2 ], function( i, n ){ 
    console.log( n ); // 分别输出：2, 1 ,0 
});

/*
    中止迭代器
 */
var each = function( ary, callback ){ 
    for ( var i = 0, l = ary.length; i < l; i++ ){ 
        if ( callback( i, ary[ i ] ) === false ){ // callback 的执行结果返回 false，提前终止迭代
            break; 
        } 
    } 
}; 

each( [ 1, 2, 3, 4, 5 ], function( i, n ){ 
    if ( n > 3 ){ // n 大于 3 的时候终止循环
        return false; 
    } 
    console.log( n ); // 分别输出：1, 2, 3 
});