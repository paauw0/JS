/**
 * 发布－订阅模式的通用实现
 */

 var event = { 
    clientList: [], 
    listen: function( key, fn ){ 
        if ( !this.clientList[ key ] ){ 
            this.clientList[ key ] = []; 
        } 
        this.clientList[ key ].push( fn ); // 订阅的消息添加进缓存列表
    }, 
    trigger: function(){ 
        var key = Array.prototype.shift.call( arguments ), // (1); 
        fns = this.clientList[ key ]; 

        if ( !fns || fns.length === 0 ){ // 如果没有绑定对应的消息
            return false; 
        } 

        for( var i = 0, fn; fn = fns[ i++ ]; ){ 
            fn.apply( this, arguments ); // (2) // arguments 是 trigger 时带上的参数
        } 
    } 
};

event.remove = function( key, fn ){ 
    var fns = this.clientList[ key ]; 
    if ( !fns ){ // 如果 key 对应的消息没有被人订阅，则直接返回
        return false; 
    } 
    if ( !fn ){ // 如果没有传入具体的回调函数，表示需要取消 key 对应消息的所有订阅
        fns && ( fns.length = 0 ); 
    }else{ 
        for ( var l = fns.length - 1; l >=0; l-- ){ // 反向遍历订阅的回调函数列表
            var _fn = fns[ l ]; 
            if ( _fn === fn ){ 
                fns.splice( l, 1 ); // 删除订阅者的回调函数
            } 
        } 
    } 
};

var installEvent = function( obj ){ 
    for ( var i in event ){ 
        obj[ i ] = event[ i ]; 
    } 
};

var salesOffices = {}; 
installEvent( salesOffices ); 

salesOffices.listen( 'squareMeter88', fn1 = function( price ){ // 小明订阅消息
    console.log( '价格= ' + price ); 
}); 

salesOffices.listen( 'squareMeter100', fn2 = function( price ){ // 小红订阅消息
    console.log( '价格= ' + price ); 
}); 

salesOffices.trigger( 'squareMeter88', 2000000 ); // 输出：2000000 
salesOffices.trigger( 'squareMeter100', 3000000 ); // 输出：3000000

salesOffices.remove( 'squareMeter88', fn1 ); // 删除小明的订阅
salesOffices.trigger( 'squareMeter88', 2000000 ); // 输出：2000000
salesOffices.trigger( 'squareMeter100', 3000000 ); // 输出：3000000
