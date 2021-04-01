/**
 * 数据统计上报
 */

/*
    分离业务代码和数据统计代码，无论在什么语言中，都是 AOP 的经典应用之一。
    在项目开发的结尾阶段难免要加上很多统计数据的代码，这些过程可能让我们被迫改动早已封装好的函数。
 */

// 比如页面中有一个登录 button，点击这个 button 会弹出登录浮层，与此同时要进行数据上报，来统计有多少用户点击了这个登录 button：
var showLogin = function(){ 
    console.log( '打开登录浮层' ); 
    log( this.getAttribute( 'tag' ) ); 
} 

var log = function( tag ){ 
    console.log( '上报标签为: ' + tag ); 
    // (new Image).src = 'http:// xxx.com/report?tag=' + tag; // 真正的上报代码略
} 

document.getElementById( 'button' ).onclick = showLogin;

// 我们看到在 showLogin 函数里，既要负责打开登录浮层，又要负责数据上报，这是两个层面的功能，在此处却被耦合在一个函数里。
// 使用 AOP 分离之后，代码如下：
Function.prototype.after = function( afterfn ){ 
    var __self = this; 
    return function(){ 
        var ret = __self.apply( this, arguments ); 
        afterfn.apply( this, arguments ); 
        return ret; 
    } 
}; 

var showLogin = function(){ 
    console.log( '打开登录浮层' ); 
} 

var log = function(){ 
    console.log( '上报标签为: ' + this.getAttribute( 'tag' ) ); 
} 

showLogin = showLogin.after( log ); // 打开登录浮层之后上报数据

document.getElementById( 'button' ).onclick = showLogin;
