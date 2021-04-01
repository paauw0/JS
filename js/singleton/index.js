/**
 * 单例模式
 * 单例模式的定义是：保证一个类仅有一个实例，并提供一个访问它的全局访问点。
 */

/*
    单例模式是一种简单但非常实用的模式，特别是惰性单例技术，在合适的时候才创建对象，并且只创建唯一的一个。
    更奇妙的是，创建对象和管理单例的职责被分布在两个不同的方法中，这两个方法组合起来才具有单例模式的威力。
 */

/*
    惰性单例
    惰性单例指的是在需要的时候才创建对象实例。
 */

// 我们就把如何管理单例的逻辑从原来的代码中抽离出来，这些逻辑被封装在 getSingle 函数内部，创建对象的方法 fn 被当成参数动态传入 getSingle 函数
var getSingle = function( fn ){ 
    var result; 
    return function(){ 
        return result || ( result = fn.apply(this, arguments) ); 
    } 
};

/*
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

// var createLoginLayer = function(){ 
//     var div = document.createElement( 'div' ); 
//     div.innerHTML = '我是登录浮窗'; 
//     div.style.display = 'none'; 
//     document.body.appendChild( div ); 
//     return div; 
// }; 
// var createSingleLoginLayer = getSingle( createLoginLayer ); 
// document.getElementById( 'loginBtn' ).onclick = function(){ 
//     var loginLayer = createSingleLoginLayer(); 
//     loginLayer.style.display = 'block'; 
// };

/*
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

// var createIframe = function(){ 
//     var iframe = document.createElement ( 'iframe' ); 
//     document.body.appendChild( iframe ); 
//     return iframe; 
// }
// var createSingleIframe = getSingle( createIframe ); 
// document.getElementById( 'loginBtn' ).onclick = function(){ 
//     var loginLayer = createSingleIframe(); 
//     loginLayer.src = 'http://baidu.com'; 
// };

/*
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

var bindEvent = getSingle(function(){ 
    document.getElementById( 'loginBtn' ).onclick = function(){ 
        alert ( 'click' ); 
    } 
    return true; 
}); 
var render = function(){ 
    console.log( '开始渲染列表' ); 
    bindEvent(); 
}; 
render(); 
render(); 
render();