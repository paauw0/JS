/**
    惰性加载函数
 */

// 在第一次进入条件分支之后，在函数内部会重写这个函数，重写之后的函数就是我们期望的 addEvent 函数，
// 在下一次进入 addEvent 函数的时候，addEvent 函数里不再存在条件分支语句
var addEvent = function( elem, type, handler ){ 
    if ( window.addEventListener ){ 
        addEvent = function( elem, type, handler ){ 
            elem.addEventListener( type, handler, false ); 
        } 
    } else if ( window.attachEvent ){ // IE7、IE8
        addEvent = function( elem, type, handler ){ 
            elem.attachEvent( 'on' + type, handler ); 
        } 
    } 
    addEvent( elem, type, handler ); 
};

var div = document.getElementById( 'div1' );

addEvent( div, 'click', function(){ 
    alert (1); 
}); 
addEvent( div, 'click', function(){ 
    alert (2); 
});