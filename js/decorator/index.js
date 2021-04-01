/**
 * 装饰者模式
 * 装饰者模式可以动态地给某个对象添加一些额外的职责，而不会影响从这个类中派生的其他对象。
 */

/*
    在传统的面向对象语言中，给对象添加功能常常使用继承的方式，但是继承的方式并不灵活，
    还会带来许多问题：一方面会导致超类和子类之间存在强耦合性，当超类改变时，子类也会随之改变；
    另一方面，继承这种功能复用方式通常被称为“白箱复用”，“白箱”是相对可见性而言的，
    在继承方式中，超类的内部细节是对子类可见的，继承常常被认为破坏了封装性。

    使用继承还会带来另外一个问题，在完成一些功能复用的同时，有可能创建出大量的子类，使子类的数量呈爆炸性增长。
    比如现在有 4 种型号的自行车，我们为每种自行车都定义了一个单独的类。
    现在要给每种自行车都装上前灯、尾灯和铃铛这 3 种配件。
    如果使用继承的方式来给每种自行车创建子类，则需要 4×3 = 12 个子类。
    但是如果把前灯、尾灯、铃铛这些对象动态组合到自行车上面，则只需要额外增加 3 个类。

    这种给对象动态地增加职责的方式称为装饰者（decorator）模式。
    装饰者模式能够在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责。
    跟继承相比，装饰者是一种更轻便灵活的做法，这是一种“即用即付”的方式，
    比如天冷了就多穿一件外套，需要飞行时就在头上插一支竹蜻蜓，遇到一堆食尸鬼时就点开 AOE（范围攻击）技能。
 */

/*
    模拟传统面向对象语言的装饰者模式
    首先要提出来的是，作为一门解释执行的语言，给 JavaScript 中的对象动态添加或者改变职责是一件再简单不过的事情，
    虽然这种做法改动了对象自身，跟传统定义中的装饰者模式并不一样，但这无疑更符合 JavaScript 的语言特色。
 */

// 代码如下：
var obj = { 
    name: 'sven', 
    address: '深圳市' 
}; 

obj.address = obj.address + '福田区';

/*
    传统面向对象语言中的装饰者模式在 JavaScript 中适用的场景并不多，如上面代码所示，通常我们并不太介意改动对象自身。
    尽管如此，本节我们还是稍微模拟一下传统面向对象语言中的装饰者模式实现。

    假设我们在编写一个飞机大战的游戏，随着经验值的增加，我们操作的飞机对象可以升级成更厉害的飞机，
    一开始这些飞机只能发射普通的子弹，升到第二级时可以发射导弹，升到第三级时可以发射原子弹。
 */

// 下面来看代码实现，首先是原始的飞机类：
var Plane = function(){} 

Plane.prototype.fire = function(){ 
    console.log( '发射普通子弹' ); 
}

// 接下来增加两个装饰类，分别是导弹和原子弹：
var MissileDecorator = function( plane ){ 
    this.plane = plane; 
} 

MissileDecorator.prototype.fire = function(){ 
    this.plane.fire(); 
    console.log( '发射导弹' ); 
} 

var AtomDecorator = function( plane ){ 
    this.plane = plane; 
} 

AtomDecorator.prototype.fire = function(){ 
    this.plane.fire(); 
    console.log( '发射原子弹' ); 
}

/*
    导弹类和原子弹类的构造函数都接受参数 plane 对象，并且保存好这个参数，
    在它们的 fire 方法中，除了执行自身的操作之外，还调用 plane 对象的 fire 方法。

    这种给对象动态增加职责的方式，并没有真正地改动对象自身，
    而是将对象放入另一个对象之中，这些对象以一条链的方式进行引用，形成一个聚合对象。
    这些对象都拥有相同的接口（fire 方法），当请求达到链中的某个对象时，这个对象会执行自身的操作，随后把请求转发给链中的下一个对象。

    因为装饰者对象和它所装饰的对象拥有一致的接口，所以它们对使用该对象的客户来说是透明的，
    被装饰的对象也并不需要了解它曾经被装饰过，这种透明性使得我们可以递归地嵌套任意多个装饰者对象
 */

// 最后看看测试结果：
var plane = new Plane(); 
plane = new MissileDecorator( plane ); 
plane = new AtomDecorator( plane ); 
plane.fire(); // 分别输出： 发射普通子弹、发射导弹、发射原子弹

/*
    装饰者也是包装器
    在《设计模式》成书之前，GoF 原想把装饰者（decorator）模式称为包装器（wrapper）模式。

    从功能上而言，decorator 能很好地描述这个模式，但从结构上看，wrapper 的说法更加贴切。
    装饰者模式将一个对象嵌入另一个对象之中，实际上相当于这个对象被另一个对象包装起来，形成一条包装链。
    请求随着这条链依次传递到所有的对象，每个对象都有处理这条请求的机会
 */

/*
    回到 JavaScript 的装饰者
    JavaScript 语言动态改变对象相当容易，我们可以直接改写对象或者对象的某个方法，并不需要使用“类”来实现装饰者模式
 */

// 代码如下：
var plane = { 
    fire: function(){ 
        console.log( '发射普通子弹' ); 
    } 
} 

var missileDecorator = function(){ 
    console.log( '发射导弹' ); 
} 

var atomDecorator = function(){ 
    console.log( '发射原子弹' ); 
} 

var fire1 = plane.fire; 

plane.fire = function(){ 
    fire1(); 
    missileDecorator(); 
} 

var fire2 = plane.fire; 
plane.fire = function(){ 
    fire2(); 
    atomDecorator(); 
} 

plane.fire(); // 分别输出： 发射普通子弹、发射导弹、发射原子弹

/*
    装饰函数
    在 JavaScript 中，几乎一切都是对象，其中函数又被称为一等对象。
    在平时的开发工作中，也许大部分时间都在和函数打交道。
    在 JavaScript 中可以很方便地给某个对象扩展属性和方法，但却很难在不改动某个函数源代码的情况下，给该函数添加一些额外的功能。
    在代码的运行期间，我们很难切入某个函数的执行环境。

    要想为函数添加一些功能，最简单粗暴的方式就是直接改写该函数，但这是最差的办法，直接违反了开放-封闭原则：

        var a = function(){ 
            alert (1); 
        }

        // 改成：
        var a = function(){ 
            alert (1); 
            alert (2); 
        }

    很多时候我们不想去碰原函数，也许原函数是由其他同事编写的，里面的实现非常杂乱。
    甚至在一个古老的项目中，这个函数的源代码被隐藏在一个我们不愿碰触的阴暗角落里。
    现在需要一个办法，在不改变函数源代码的情况下，能给函数增加功能，这正是开放-封闭原则给我们指出的光明道路。

    我们已经找到了一种答案，通过保存原引用的方式就可以改写某个函数：

        var a = function(){ 
            alert (1); 
        } 

        var _a = a; 

        a = function(){ 
            _a(); 
            alert (2); 
        } 

        a();
    
    这是实际开发中很常见的一种做法，比如我们想给 window 绑定 onload 事件，
    但是又不确定这个事件是不是已经被其他人绑定过，为了避免覆盖掉之前的 window.onload 函数中的行为，
    我们一般都会先保存好原先的 window.onload，把它放入新的 window.onload 里执行：

        window.onload = function(){ 
            alert (1); 
        } 

        var _onload = window.onload || function(){}; 

        window.onload = function(){ 
            _onload(); 
            alert (2); 
        }

    这样的代码当然是符合开放-封闭原则的，我们在增加新功能的时候，确实没有修改原来的window.onload 代码，但是这种方式存在以下两个问题。

        必须维护_onload 这个中间变量，虽然看起来并不起眼，但如果函数的装饰链较长，或者需要装饰的函数变多，这些中间变量的数量也会越来越多。

        其实还遇到了 this 被劫持的问题，在 window.onload 的例子中没有这个烦恼，
        是因为调用普通函数_onload 时，this 也指向 window，
        跟调用 window.onload 时一样（函数作为对象的方法被调用时，this 指向该对象，所以此处 this 也只指向 window）。

    现在把 window.onload 换成 document.getElementById，代码如下:

        var _getElementById = document.getElementById;

        document.getElementById = function( id ){ 
            alert (1); 
            return _getElementById( id ); // (1) 
        } 

        var button = document.getElementById( 'button' );

    执行这段代码，我们看到在弹出 alert(1) 之后，紧接着控制台抛出了异常：

        // 输出： Uncaught TypeError: Illegal invocation
    
    异常发生在(1) 处的 _getElementById( id ) 这句代码上，此时 _getElementById 是一个全局函数，
    当调用一个全局函数时，this 是指向 window 的，
    而 document.getElementById 方法的内部实现需要使用 this 引用，this 在这个方法内预期是指向 document，而不是 window, 这是错误发生的原因，
    所以使用现在的方式给函数增加功能并不保险。

    改进后的代码可以满足需求，我们要手动把 document 当作上下文 this 传入_getElementById：

        var _getElementById = document.getElementById; 

        document.getElementById = function(){ 
            alert (1); 
            return _getElementById.apply( document, arguments ); 
        } 

        var button = document.getElementById( 'button' );

    但这样做显然很不方便，下面我们引入本书 3.7 节介绍过的 AOP，来提供一种完美的方法给函数动态增加功能。
 */

/*
    用 AOP 装饰函数
 */

// 首先给出 Function.prototype.before 方法和 Function.prototype.after 方法：
Function.prototype.before = function( beforefn ){ 
    var __self = this; // 保存原函数的引用
    console.log(__self)
    return function(){ // 返回包含了原函数和新函数的"代理"函数
        console.log("this", this)
        beforefn.apply( this, arguments ); // 执行新函数，且保证 this 不被劫持，新函数接受的参数也会被原封不动地传入原函数，新函数在原函数之前执行
        return __self.apply( this, arguments ); // 执行原函数并返回原函数的执行结果，
        // 并且保证 this 不被劫持
    } 
} 

Function.prototype.after = function( afterfn ){ 
    var __self = this; 
    return function(){ 
        var ret = __self.apply( this, arguments ); 
        afterfn.apply( this, arguments ); 
        return ret; 
    } 
};

/*
    Function.prototype.before 接受一个函数当作参数，这个函数即为新添加的函数，它装载了新添加的功能代码。

    接下来把当前的 this 保存起来，这个 this 指向原函数，然后返回一个“代理”函数，这个“代理”函数只是结构上像代理而已，
    并不承担代理的职责（比如控制对象的访问等）。
    它的工作是把请求分别转发给新添加的函数和原函数，且负责保证它们的执行顺序，让新添加的函数在原函数之前执行（前置装饰），
    这样就实现了动态装饰的效果。

    我们注意到，通过 Function.prototype.apply 来动态传入正确的 this，保证了函数在被装饰之后，this 不会被劫持。

    Function.prototype.after 的原理跟 Function.prototype.before 一模一样，唯一不同的地方在于让新添加的函数在原函数执行之后再执行。
 */

// 下面来试试用 Function.prototype.before 的威力：
document.getElementById = document.getElementById.before(function(){ 
    alert (1); 
}); 

var button = document.getElementById( 'button' );

console.log( button );

// 再回到 window.onload 的例子，看看用 Function.prototype.before 来增加新的 window.onload 事件是多么简单：
window.onload = function(){ 
    alert (1); 
} 

window.onload = ( window.onload || function(){} ).after(function(){ 
    alert (2); 
}).after(function(){ 
    alert (3); 
}).after(function(){ 
    alert (4); 
});


// 值得提到的是，上面的 AOP 实现是在 Function.prototype 上添加 before 和 after 方法，
// 但许多人不喜欢这种污染原型的方式，那么我们可以做一些变通，把原函数和新函数都作为参数传入 before 或者 after 方法：
var before = function( fn, beforefn ){ 
    return function(){ 
        beforefn.apply( this, arguments ); 
        return fn.apply( this, arguments ); 
    } 
} 

var a = before( 
    function(){alert (3)}, 
    function(){alert (2)} 
); 

a = before( a, function(){alert (1);} ); 
a();

/*
    AOP 的应用实例
    用 AOP 装饰函数的技巧在实际开发中非常有用。
    不论是业务代码的编写，还是在框架层面，我们都可以把行为依照职责分成粒度更细的函数，随后通过装饰把它们合并到一起，
    这有助于我们编写一个松耦合和高复用性的系统。
 */

/*
    装饰者模式和代理模式
    装饰者模式和代理模式的结构看起来非常相像，
    这两种模式都描述了怎样为对象提供一定程度上的间接引用，它们的实现部分都保留了对另外一个对象的引用，并且向那个对象发送请求。

    代理模式和装饰者模式最重要的区别在于它们的意图和设计目的。
    代理模式的目的是，当直接访问本体不方便或者不符合需要时，为这个本体提供一个替代者。
    本体定义了关键功能，而代理提供或拒绝对它的访问，或者在访问本体之前做一些额外的事情。
    装饰者模式的作用就是为对象动态加入行为。
    换句话说，代理模式强调一种关系（Proxy 与它的实体之间的关系），这种关系可以静态的表达，
    也就是说，这种关系在一开始就可以被确定。
    而装饰者模式用于一开始不能确定对象的全部功能时。
    代理模式通常只有一层代理-本体的引用，而装饰者模式经常会形成一条长长的装饰链。

    在虚拟代理实现图片预加载的例子中，本体负责设置 img 节点的 src，代理则提供了预加载的功能，
    这看起来也是“加入行为”的一种方式，但这种加入行为的方式和装饰者模式的偏重点是不一样的。
    装饰者模式是实实在在的为对象增加新的职责和行为，而代理做的事情还是跟本体一样，最终都是设置 src。
    但代理可以加入一些“聪明”的功能，比如在图片真正加载好之前，先使用一张占位的 loading 图片反馈给客户。
 */

/*
    本章通过数据上报、统计函数的执行时间、动态改变函数参数以及插件式的表单验证这 4 个例子，
    我们了解了装饰函数，它是 JavaScript 中独特的装饰者模式。
    这种模式在实际开发中非常有用，除了上面提到的例子，它在框架开发中也十分有用。
    作为框架作者，我们希望框架里的函数提供的是一些稳定而方便移植的功能，那些个性化的功能可以在框架之外动态装饰上去，
    这可以避免为了让框架拥有更多的功能，而去使用一些 if、else 语句预测用户的实际需要。
 */