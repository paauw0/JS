/**
 * 用AOP动态改变函数的参数
 */

// 观察 Function.prototype.before 方法：
Function.prototype.before = function( beforefn ){ 
    var __self = this; 
    return function(){ 
        beforefn.apply( this, arguments ); // (1) 
        return __self.apply( this, arguments ); // (2) 
    } 
}

/*
    从这段代码的(1)处 和(2)处可以看到，beforefn 和原函数 __self 共用一组参数列表 arguments，
    当我们在 beforefn 的函数体内改变 arguments 的时候，原函数 __self 接收的参数列表自然也会变化。
 */

// 下面的例子展示了如何通过 Function.prototype.before 方法给函数 func 的参数 param 动态地添加属性 b：
var func = function( param ){ 
    console.log( param ); // 输出： {a: "a", b: "b"} 
} 

func = func.before( function( param ){ 
    param.b = 'b'; 
}); 

func( {a: 'a'} );

// 现在有一个用于发起 ajax 请求的函数，这个函数负责项目中所有的 ajax 异步请求：
var ajax = function( type, url, param ){ 
    console.dir(param); 
    // 发送 ajax 请求的代码略
};

ajax( 'get', 'http:// xxx.com/userinfo', { name: 'sven' } );

/*
    上面的伪代码表示向后台 cgi 发起一个请求来获取用户信息，传递给 cgi 的参数是{ name: 'sven' }。
    ajax 函数在项目中一直运转良好，跟 cgi 的合作也很愉快。
    直到有一天，我们的网站遭受了 CSRF 攻击。
    解决 CSRF 攻击最简单的一个办法就是在 HTTP 请求中带上一个 Token 参数。
 */

// 假设我们已经有一个用于生成 Token 的函数：
var getToken = function(){ 
    return 'Token'; 
}

// 现在的任务是给每个 ajax 请求都加上 Token 参数：
var ajax = function( type, url, param ){ 
    param = param || {}; 
    param.Token = getToken(); // 发送 ajax 请求的代码略... 
};

/*
    虽然已经解决了问题，但我们的 ajax 函数相对变得僵硬了，每个从 ajax 函数里发出的请求都自动带上了 Token 参数，
    虽然在现在的项目中没有什么问题，但如果将来把这个函数移植到其他项目上，或者把它放到一个开源库中供其他人使用，Token 参数都将是多余的。
    也许另一个项目不需要验证 Token，或者是 Token 的生成方式不同，无论是哪种情况，都必须重新修改 ajax 函数。
 */

// 为了解决这个问题，先把 ajax 函数还原成一个干净的函数：
var ajax = function( type, url, param ){ 
    console.log(param); // 发送 ajax 请求的代码略
};

// 然后把 Token 参数通过 Function.prototyte.before 装饰到 ajax 函数的参数 param 对象中：
var getToken = function(){ 
    return 'Token'; 
}

ajax = ajax.before(function( type, url, param ){ 
    param.Token = getToken(); 
});

ajax( 'get', 'http:// xxx.com/userinfo', { name: 'sven' } );

/*
    从 ajax 函数打印的 log 可以看到，Token 参数已经被附加到了 ajax 请求的参数中：
    
        {name: "sven", Token: "Token"}

    明显可以看到，用 AOP 的方式给 ajax 函数动态装饰上 Token 参数，保证了 ajax 函数是一个相对纯净的函数，
    提高了 ajax 函数的可复用性，它在被迁往其他项目的时候，不需要做任何修改。
*/