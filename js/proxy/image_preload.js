/**
 * 虚拟代理实现图片预加载
 */

var myImage = (function(){ 
    var imgNode = document.createElement( 'img' ); 
    document.body.appendChild( imgNode ); 
    return { 
        setSrc: function( src ){ 
            imgNode.src = src; 
        } 
    } 
})(); 

// 引入代理对象 proxyImage，通过这个代理对象，在图片被真正加载好之前，页面中将出现一张占位图, 来提示用户图片正在加载。
var proxyImage = (function(){
    var img = new Image; 
    img.onload = function(){ 
        myImage.setSrc( this.src ); 
    } 
    return { 
        setSrc: function( src ){
            myImage.setSrc( 'file://C:/Users/Lenovo/Desktop/素材/background.jpg' ); 
            img.src = src; 
        } 
    } 
})();

proxyImage.setSrc( 'https://pcredivewiki.tw/static/images/unit_big/unit_big_110931.jpg' );

/*
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

// 如果代理对象和本体对象都为一个函数（函数也是对象），函数必然都能被执行，则可以认为它们也具有一致的“接口”
// var myImage = (function(){ 
//     var imgNode = document.createElement( 'img' ); 
//     document.body.appendChild( imgNode ); 
//     return function( src ){ 
//         imgNode.src = src; 
//     } 
// })();

// var proxyImage = (function(){ 
//     var img = new Image; 
//     img.onload = function(){ 
//         myImage( this.src ); 
//     } 
//     return function( src ){ 
//         myImage( 'file://C:/Users/Lenovo/Desktop/素材/background.jpg' );
//         img.src = src;
//     } 
// })();

// proxyImage( 'https://pcredivewiki.tw/static/images/unit_big/unit_big_110931.jpg' );