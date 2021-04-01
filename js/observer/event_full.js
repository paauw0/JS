/*
    必须先订阅再发布吗
    我们还需要一个方案，使得我们的发布—订阅对象拥有先发布后订阅的能力。
    为了满足这个需求，我们要建立一个存放离线事件的堆栈，
    当事件发布的时候，如果此时还没有订阅者来订阅这个事件，
    我们暂时把发布事件的动作包裹在一个函数里，这些包装函数将被存入堆栈中，
    等到终于有对象来订阅此事件的时候，我们将遍历堆栈并且依次执行这些包装函数，也就是重新发布里面的事件。
    当然离线事件的生命周期只有一次，就像 QQ 的未读消息只会被重新阅读一次，所以刚才的操作我们只能进行一次。
 */

/*
    全局事件的命名冲突
    全局的发布—订阅对象里只有一个 clinetList 来存放消息名和回调函数，大家都通过它来订阅和发布各种消息，
    久而久之，难免会出现事件名冲突的情况，所以我们还可以给 Event 对象提供创建命名空间的功能。
 */

var Event = (function(){ 
    var global = this, 
    Event, 
    _default = 'default'; 

    Event = function(){ 
        var _listen, 
            _trigger, 
            _remove, 
            _slice = Array.prototype.slice, 
            _shift = Array.prototype.shift, 
            _unshift = Array.prototype.unshift, 
            namespaceCache = {}, 
            _create, 
            find,
            each;

        each = function( ary, fn ){ 
            var ret; 
            for ( var i = 0, l = ary.length; i < l; i++ ){
                var n = ary[i]; 
                ret = fn.call( n, i, n); 
            } 
            return ret; 
        }; 

        _listen = function( key, fn, cache ){ 
            if ( !cache[ key ] ){ 
                cache[ key ] = []; 
            } 
            cache[key].push( fn ); 
        };

        _remove = function( key, cache ,fn){ 
            if ( cache[ key ] ){ 
                if( fn ){ 
                    for( var i = cache[ key ].length; i >= 0; i-- ){ 
                        if( cache[ key ][i] === fn ){ 
                            cache[ key ].splice( i, 1 ); 
                        } 
                    } 
                }else{ 
                    cache[ key ] = []; 
                } 
            } 
        }; 

        _trigger = function(){ 
            var cache = _shift.call(arguments), 
            key = _shift.call(arguments), 
            args = arguments, 
            _self = this, 
            ret, 
            stack = cache[ key ]; 
            if ( !stack || !stack.length ){ 
                return; 
            } 
            return each( stack, function(){ 
                return this.apply( _self, args ); 
            }); 
        };

        _create = function( namespace ){ 
            var namespace = namespace || _default; 
            var cache = {}, 
            offlineStack = [], // 离线事件 
            ret = { 
                listen: function( key, fn, last ){ 
                    _listen( key, fn, cache ); 
                    if ( offlineStack === null ){ 
                        return; 
                    } 
                    if ( last === 'last' ){
                        offlineStack.length && offlineStack.pop()(); 
                    }else{ 
                        each( offlineStack, function(){ 
                            this(); 
                        }); 
                    } 
                    offlineStack = null; 
                }, 

                one: function( key, fn, last ){ 
                    _remove( key, cache ); 
                    this.listen( key, fn ,last ); 
                }, 

                remove: function( key, fn ){ 
                    _remove( key, cache ,fn); 
                }, 

                trigger: function(){ 
                    var fn, 
                    args, 
                    _self = this; 
                    _unshift.call( arguments, cache ); 
                    args = arguments; 
                    fn = function(){ 
                        return _trigger.apply( _self, args ); 
                    }; 
                    if ( offlineStack ){ 
                        return offlineStack.push( fn ); 
                    } 
                    return fn(); 
                } 
            }; 

            return namespace 
                ? ( namespaceCache[ namespace ]
                    ? namespaceCache[ namespace ]
                    : namespaceCache[ namespace ] = ret ) 
                : ret; 
        }; 
        return { 
            create: _create, 

            one: function( key, fn, last ){ 
                var event = this.create( ); 
                event.one( key,fn,last ); 
            }, 

            remove: function( key, fn ){ 
                var event = this.create( ); 
                event.remove( key,fn ); 
            }, 

            listen: function( key, fn, last ){ 
                var event = this.create( ); 
                event.listen( key, fn, last ); 
            },

            trigger: function(){
                var event = this.create( ); 
                event.trigger.apply( this, arguments ); 
            } 
        }; 
    }(); 
    return Event; 
})();




/************** 先发布后订阅 ********************/ 
Event.trigger( 'click', 1 ); 

Event.listen( 'click', function( a ){ 
    console.log( a ); // 输出：1 
}); 

/************** 使用命名空间 ********************/ 
Event.create( 'namespace1' ).listen( 'click', function( a ){ 
    console.log( a ); // 输出：1 
}); 

Event.create( 'namespace1' ).trigger( 'click', 1 ); 

Event.create( 'namespace2' ).listen( 'click', function( a ){ 
    console.log( a ); // 输出：2 
}); 

Event.create( 'namespace2' ).trigger( 'click', 2 );