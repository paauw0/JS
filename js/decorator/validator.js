/**
 * 插件式的表单验证
 */

/*
    我们很多人都写过许多表单验证的代码，在一个 Web 项目中，可能存在非常多的表单，
    如注册、登录、修改用户信息等。在表单数据提交给后台之前，常常要做一些校验，
    比如登录的时候需要验证用户名和密码是否为空
 */

// 代码如下：
var username = document.getElementById( 'username' ), 
    password = document.getElementById( 'password' ), 
    submitBtn = document.getElementById( 'submitBtn' ); 

var formSubmit = function(){ 
    if ( username.value === '' ){ 
        return alert ( '用户名不能为空' ); 
    } 

    if ( password.value === '' ){ 
        return alert ( '密码不能为空' ); 
    } 

    var param = { 
        username: username.value, 
        password: password.value 
    } 

    ajax( 'http:// xxx.com/login', param ); // ajax 具体实现略
} 

submitBtn.onclick = function(){ 
    formSubmit(); 
}

/*
    formSubmit 函数在此处承担了两个职责，除了提交 ajax 请求之外，还要验证用户输入的合法性。
    这种代码一来会造成函数臃肿，职责混乱，二来谈不上任何可复用性。

    本节的目的是分离校验输入和提交 ajax 请求的代码，我们把校验输入的逻辑放到 validata 函数中，
    并且约定当 validata 函数返回 false 的时候，表示校验未通过
 */

// 代码如下：
var validata = function(){ 
    if ( username.value === '' ){ 
        alert ( '用户名不能为空' ); 
        return false; 
    } 

    if ( password.value === '' ){ 
        alert ( '密码不能为空' ); 
        return false; 
    } 
} 

var formSubmit = function(){ 
    if ( validata() === false ){ // 校验未通过
        return; 
    }

    var param = {
        username: username.value, 
        password: password.value 
    } 

    ajax( 'http:// xxx.com/login', param ); 
} 

submitBtn.onclick = function(){ 
    formSubmit(); 
}

/*
    现在的代码已经有了一些改进，我们把校验的逻辑都放到了 validata 函数中，
    但 formSubmit 函数的内部还要计算 validata 函数的返回值，因为返回值的结果表明了是否通过校验。

    接下来进一步优化这段代码，使 validata 和 formSubmit 完全分离开来。
    首先要改写 Function.prototype.before，如果 beforefn 的执行结果返回 false，表示不再执行后面的原函数
 */

// 代码如下：
Function.prototype.before = function( beforefn ){ 
    var __self = this; 
    return function(){ 
        if ( beforefn.apply( this, arguments ) === false ){ 
            // beforefn 返回 false 的情况直接 return，不再执行后面的原函数
            return; 
        } 
        return __self.apply( this, arguments ); 
    } 
}

var validata = function(){ 
    if ( username.value === '' ){ 
        alert ( '用户名不能为空' ); 
        return false; 
    } 

    if ( password.value === '' ){ 
        alert ( '密码不能为空' ); 
        return false; 
    } 
} 

var formSubmit = function(){ 
    if ( validata() === false ){ // 校验未通过
        return; 
    }

    var param = {
        username: username.value, 
        password: password.value 
    } 

    ajax( 'http:// xxx.com/login', param ); 
} 

formSubmit = formSubmit.before( validata );

submitBtn.onclick = function(){ 
    formSubmit(); 
}

/*
    在这段代码中，校验输入和提交表单的代码完全分离开来，它们不再有任何耦合关系，
    formSubmit = formSubmit.before( validata )这句代码，如同把校验规则动态接在 formSubmit 函数之前，
    validata 成为一个即插即用的函数，它甚至可以被写成配置文件的形式，这有利于我们分开维护这两个函数。
    再利用策略模式稍加改造，我们就可以把这些校验规则都写成插件的形式，用在不同的项目当中。
 */

/*
    值得注意的是，因为函数通过 Function.prototype.before 或者 Function.prototype.after 被装饰之后，
    返回的实际上是一个新的函数，如果在原函数上保存了一些属性，那么这些属性会丢失。
 */

// 代码如下：
var func = function(){ 
    alert( 1 ); 
} 

func.a = 'a'; 

func = func.after( function(){ 
    alert( 2 ); 
}); 

alert ( func.a ); // 输出：undefined

// 另外，这种装饰方式也叠加了函数的作用域，如果装饰的链条过长，性能上也会受到一些影响。