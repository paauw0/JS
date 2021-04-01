/**
 * 状态模式
 * 状态模式的关键是区分事物内部的状态，事物内部状态的改变往往会带来事物的行为改变。
 */

/*
    初识状态模式
    我们来想象这样一个场景：有一个电灯，电灯上面只有一个开关。当电灯开着的时候，此时按下开关，电灯会切换到关闭状态；
    再按一次开关，电灯又将被打开。
    同一个开关按钮，在不同的状态下，表现出来的行为是不一样的。

    现在用代码来描述这个场景，首先定义一个 Light 类，可以预见，电灯对象 light 将从 Light 类创建而出， 
    light 对象将拥有两个属性，我们用 state 来记录电灯当前的状态，用 button 表示具体的开关按钮。
    下面来编写这个电灯程序的例子。
 */

/*
    第一个例子：电灯程序
 */

// 首先给出不用状态模式的电灯程序实现：
var Light = function(){ 
    this.state = 'off'; // 给电灯设置初始状态 off 
    this.button = null; // 电灯开关按钮
};

// 接下来定义 Light.prototype.init 方法，该方法负责在页面中创建一个真实的 button 节点，
// 假设这个 button 就是电灯的开关按钮，当 button 的 onclick 事件被触发时，就是电灯开关被按下的时候，代码如下：
Light.prototype.init = function(){ 
    var button = document.createElement( 'button' ), 
        self = this; 

    button.innerHTML = '开关'; 
    this.button = document.body.appendChild( button ); 
    this.button.onclick = function(){ 
        self.buttonWasPressed(); 
    } 
};

// 当开关被按下时，程序会调用 self.buttonWasPressed 方法， 开关按下之后的所有行为，都将被封装在这个方法里，代码如下：
Light.prototype.buttonWasPressed = function(){ 
    if ( this.state === 'off' ){ 
        console.log( '开灯' ); 
        this.state = 'on'; 
    }else if ( this.state === 'on' ){ 
        console.log( '关灯' ); 
        this.state = 'off'; 
    } 
}; 

var light = new Light(); 
light.init();

/*
    OK，现在可以看到，我们已经编写了一个强壮的状态机，这个状态机的逻辑既简单又缜密，看起来这段代码设计得无懈可击，这个程序没有任何 bug。
    实际上这种代码我们已经编写过无数遍，比如要交替切换一个 button 的 class，跟此例一样，
    往往先用一个变量 state 来记录按钮的当前状态，在事件发生时，再根据这个状态来决定下一步的行为。

    令人遗憾的是，这个世界上的电灯并非只有一种。
    许多酒店里有另外一种电灯，这种电灯也只有一个开关，但它的表现是：第一次按下打开弱光，第二次按下打开强光，第三次才是关闭电灯。
    现在必须改造上面的代码来完成这种新型电灯的制造：

        Light.prototype.buttonWasPressed = function(){ 
            if ( this.state === 'off' ){ 
                console.log( '弱光' ); 
                this.state = 'weakLight'; 
            }else if ( this.state === 'weakLight' ){ 
                console.log( '强光' ); 
                this.state = 'strongLight'; 
            }else if ( this.state === 'strongLight' ){ 
                console.log( '关灯' ); 
                this.state = 'off'; 
            } 
        };

    现在这个反例先告一段落，我们来考虑一下上述程序的缺点。

        很明显 buttonWasPressed 方法是违反开放封闭原则的，每次新增或者修改 light 的状态，
        都需要改动 buttonWasPressed 方法中的代码，这使得 buttonWasPressed 成为了一个非常不稳定的方法。

        所有跟状态有关的行为，都被封装在 buttonWasPressed 方法里，
        如果以后这个电灯又增加了强强光、超强光和终极强光，那我们将无法预计这个方法将膨胀到什么地步。
        当然为了简化示例，此处在状态发生改变的时候，只是简单地打印一条 log 和改变 button 的 innerHTML。
        在实际开发中，要处理的事情可能比这多得多，也就是说，buttonWasPressed 方法要比现在庞大得多。

        状态的切换非常不明显，仅仅表现为对 state 变量赋值，比如 this.state = 'weakLight'。
        在实际开发中，这样的操作很容易被程序员不小心漏掉。
        我们也没有办法一目了然地明白电灯一共有多少种状态，除非耐心地读完 buttonWasPressed 方法里的所有代码。
        当状态的种类多起来的时候，某一次切换的过程就好像被埋藏在一个巨大方法的某个阴暗角落里。

        状态之间的切换关系，不过是往 buttonWasPressed 方法里堆砌 if、else 语句，
        增加或者修改一个状态可能需要改变若干个操作，这使 buttonWasPressed 更加难以阅读和维护。
 */

/*
    状态模式改进电灯程序
    现在我们学习使用状态模式改进电灯的程序。
    有意思的是，通常我们谈到封装，一般都会优先封装对象的行为，而不是对象的状态。
    但在状态模式中刚好相反，状态模式的关键是把事物的每种状态都封装成单独的类，跟此种状态有关的行为都被封装在这个类的内部，
    所以 button 被按下的的时候，只需要在上下文中，把这个请求委托给当前的状态对象即可，该状态对象会负责渲染它自身的行为

    同时我们还可以把状态的切换规则事先分布在状态类中， 这样就有效地消除了原本存在的大量条件分支语句
 */

/*
    下面进入状态模式的代码编写阶段，首先将定义 3 个状态类，分别是 offLightState、WeakLightState、strongLightState。
    这 3 个类都有一个原型方法 buttonWasPressed，代表在各自状态下，按钮被按下时将发生的行为
 */

// 代码如下：
// OffLightState：
var OffLightState = function( light ){ 
    this.light = light; 
}; 

OffLightState.prototype.buttonWasPressed = function(){ 
    console.log( '弱光' ); // offLightState 对应的行为
    this.light.setState( this.light.weakLightState ); // 切换状态到 weakLightState 
}; 

// WeakLightState：
var WeakLightState = function( light ){ 
    this.light = light; 
}; 

WeakLightState.prototype.buttonWasPressed = function(){ 
    console.log( '强光' ); // weakLightState 对应的行为
    this.light.setState( this.light.strongLightState ); // 切换状态到 strongLightState 
}; 

// StrongLightState：
var StrongLightState = function( light ){ 
    this.light = light; 
}; 

StrongLightState.prototype.buttonWasPressed = function(){ 
    console.log( '关灯' ); // strongLightState 对应的行为
    this.light.setState( this.light.offLightState ); // 切换状态到 offLightState 
};

/*
    接下来改写 Light 类，现在不再使用一个字符串来记录当前的状态，而是使用更加立体化的状态对象。
    我们在 Light 类的构造函数里为每个状态类都创建一个状态对象，这样一来我们可以很明显地看到电灯一共有多少种状态
 */

// 代码如下：
var Light = function(){ 
    this.offLightState = new OffLightState( this ); 
    this.weakLightState = new WeakLightState( this ); 
    this.strongLightState = new StrongLightState( this ); 
    this.button = null; 
};

/*
    在 button 按钮被按下的事件里，Context 也不再直接进行任何实质性的操作，
    而是通过self.currState.buttonWasPressed()将请求委托给当前持有的状态对象去执行
 */

// 代码如下：
Light.prototype.init = function(){ 
    var button = document.createElement( 'button' ), 
    self = this;

    this.button = document.body.appendChild( button ); 
    this.button.innerHTML = '开关'; 

    this.currState = this.offLightState; // 设置当前状态

    this.button.onclick = function(){ 
        self.currState.buttonWasPressed(); 
    } 
};

/*
    最后还要提供一个 Light.prototype.setState 方法，状态对象可以通过这个方法来切换 light 对象的状态。
    前面已经说过，状态的切换规律事先被完好定义在各个状态类中。
 */

// 在 Context 中再也找不到任何一个跟状态切换相关的条件分支语句：
Light.prototype.setState = function( newState ){ 
    this.currState = newState; 
};

// 现在可以进行一些测试：
var light = new Light(); 
light.init();

/*
    不出意外的话，执行结果跟之前的代码一致，但是使用状态模式的好处很明显，它可以使每一种状态和它对应的行为之间的关系局部化，
    这些行为被分散和封装在各自对应的状态类之中，便于阅读和管理代码。

    另外，状态之间的切换都被分布在状态类内部，这使得我们无需编写过多的 if、else 条件分支语言来控制状态之间的转换。

    当我们需要为 light 对象增加一种新的状态时，只需要增加一个新的状态类，再稍稍改变一些现有的代码即可。
 */

// 假设现在 light 对象多了一种超强光的状态，那就先增加 SuperStrongLightState类：
var SuperStrongLightState = function( light ){ 
    this.light = light; 
}; 

SuperStrongLightState.prototype.buttonWasPressed = function(){ 
    console.log( '关灯' ); 
    this.light.setState( this.light.offLightState ); 
};

// 然后在 Light 构造函数里新增一个 superStrongLightState 对象：
var Light = function(){ 
    this.offLightState = new OffLightState( this ); 
    this.weakLightState = new WeakLightState( this );
    this.strongLightState = new StrongLightState( this ); 
    this.superStrongLightState = new SuperStrongLightState( this ); // 新增 superStrongLightState 对象
    this.button = null; 
};

// 最后改变状态类之间的切换规则，
// 从 StrongLightState---->OffLightState 变为 StrongLightState---->SuperStrongLightState ---->OffLightState：
StrongLightState.prototype.buttonWasPressed = function(){ 
    console.log( '超强光' ); // strongLightState 对应的行为
    this.light.setState( this.light.superStrongLightState ); // 切换状态到 offLightState 
};

/*
    缺少抽象类的变通方式
    我们看到，在状态类中将定义一些共同的行为方法，Context 最终会将请求委托给状态对象的这些方法，
    在这个例子里，这个方法就是 buttonWasPressed。无论增加了多少种状态类，它们都必须实现 buttonWasPressed 方法。

    在 Java 中，所有的状态类必须继承自一个 State 抽象父类，
    当然如果没有共同的功能值得放入抽象父类中，也可以选择实现 State 接口。
    这样做的原因一方面是我们曾多次提过的向上转型，另一方面是保证所有的状态子类都实现了 buttonWasPressed 方法。
    遗憾的是，JavaScript 既不支持抽象类，也没有接口的概念。
    所以在使用状态模式的时候要格外小心，如果我们编写一个状态子类时，
    忘记了给这个状态子类实现 buttonWasPressed 方法，则会在状态切换的时候抛出异常。
    因为 Context 总是把请求委托给状态对象的 buttonWasPressed 方法。
 */

/*
    不论怎样严格要求程序员，也许都避免不了犯错的那一天，毕竟如果没有编译器的帮助，
    只依靠程序员的自觉以及一点好运气，是不靠谱的。
 */

// 这里建议的解决方案跟《模板方法模式》中一致，让抽象父类的抽象方法直接抛出一个异常，这个异常至少会在程序运行期间就被发现：
var State = function(){}; 

State.prototype.buttonWasPressed = function(){ 
    throw new Error( '父类的 buttonWasPressed 方法必须被重写' ); 
}; 
var SuperStrongLightState = function( light ){
    this.light = light; 
}; 

SuperStrongLightState.prototype = new State(); // 继承抽象父类

SuperStrongLightState.prototype.buttonWasPressed = function(){ // 重写 buttonWasPressed 方法
    console.log( '关灯' ); 
    this.light.setState( this.light.offLightState ); 
};

/*
    状态模式的优缺点
    状态模式的优点如下。

        状态模式定义了状态与行为之间的关系，并将它们封装在一个类里。通过增加新的状态类，很容易增加新的状态和转换。

        避免 Context 无限膨胀，状态切换的逻辑被分布在状态类中，也去掉了 Context 中原本过多的条件分支。

        用对象代替字符串来记录当前状态，使得状态的切换更加一目了然。

        Context 中的请求动作和状态类中封装的行为可以非常容易地独立变化而互不影响。

    状态模式的缺点是会在系统中定义许多状态类，编写 20 个状态类是一项枯燥乏味的工作，而且系统中会因此而增加不少对象。
    另外，由于逻辑分散在状态类中，虽然避开了不受欢迎的条件分支语句，但也造成了逻辑分散的问题，我们无法在一个地方就看出整个状态机的逻辑。
 */

/*
    状态模式中的性能优化点

        有两种选择来管理 state 对象的创建和销毁。
        第一种是仅当 state 对象被需要时才创建并随后销毁，另一种是一开始就创建好所有的状态对象，并且始终不销毁它们。
        如果 state 对象比较庞大，可以用第一种方式来节省内存，这样可以避免创建一些不会用到的对象并及时地回收它们。
        但如果状态的改变很频繁，最好一开始就把这些 state 对象都创建出来，也没有必要销毁它们，因为可能很快将再次用到它们。

        在本章的例子中，我们为每个 Context 对象都创建了一组 state 对象，实际上这些 state 对象之间是可以共享的，
        各 Context 对象可以共享一个 state 对象，这也是享元模式的应用场景之一。
 */

/*
    状态模式和策略模式的关系
    状态模式和策略模式像一对双胞胎，它们都封装了一系列的算法或者行为，
    它们的类图看起来几乎一模一样，但在意图上有很大不同，因此它们是两种迥然不同的模式。

    策略模式和状态模式的相同点是，它们都有一个上下文、一些策略或者状态类，上下文把请求委托给这些类来执行。

    它们之间的区别是策略模式中的各个策略类之间是平等又平行的，它们之间没有任何联系，
    所以客户必须熟知这些策略类的作用，以便客户可以随时主动切换算法；
    而在状态模式中，状态和状态对应的行为是早已被封装好的，状态之间的切换也早被规定完成，“改变行为”这件事情发生在状态模式内部。
    对客户来说，并不需要了解这些细节。
    这正是状态模式的作用所在。
 */

/*
    JavaScript 版本的状态机
    前面两个示例都是模拟传统面向对象语言的状态模式实现，我们为每种状态都定义一个状态子类，
    然后在 Context 中持有这些状态对象的引用，以便把 currState 设置为当前的状态对象。

    状态模式是状态机的实现之一，但在 JavaScript 这种“无类”语言中，没有规定让状态对象一定要从类中创建而来。
    另外一点，JavaScript 可以非常方便地使用委托技术，并不需要事先让一个对象持有另一个对象。
    下面的状态机选择了通过 Function.prototype.call 方法直接把请求委托给某个字面量对象来执行。
 */

// 下面改写电灯的例子，来展示这种更加轻巧的做法：
var Light = function(){ 
    this.currState = FSM.off; // 设置当前状态
    this.button = null; 
};

Light.prototype.init = function(){ 
    var button = document.createElement( 'button' ), 
        self = this; 

    button.innerHTML = '已关灯'; 
    this.button = document.body.appendChild( button ); 

    this.button.onclick = function(){ 
        self.currState.buttonWasPressed.call( self ); // 把请求委托给 FSM 状态机
    } 
};

var FSM = { 
    off: { 
        buttonWasPressed: function(){ 
            console.log( '关灯' ); 
            this.button.innerHTML = '下一次按我是开灯'; 
            this.currState = FSM.on; 
        } 
    }, 
    on: {
        buttonWasPressed: function(){ 
            console.log( '开灯' ); 
            this.button.innerHTML = '下一次按我是关灯'; 
            this.currState = FSM.off; 
        } 
    } 
}; 

var light = new Light(); 
light.init();

// 接下来尝试另外一种方法，即利用下面的 delegate 函数来完成这个状态机编写。
// 这是面向对象设计和闭包互换的一个例子，前者把变量保存为对象的属性，而后者把变量封闭在闭包形成的环境中：
var delegate = function( client, delegation ){ 
    return { 
        buttonWasPressed: function(){ // 将客户的操作委托给 delegation 对象
            return delegation.buttonWasPressed.apply( client, arguments ); 
        } 
    } 
}; 

var FSM = { 
    off: { 
        buttonWasPressed: function(){ 
            console.log( '关灯' ); 
            this.button.innerHTML = '下一次按我是开灯'; 
            this.currState = this.onState; 
        } 
    }, 
    on: { 
        buttonWasPressed: function(){ 
            console.log( '开灯' ); 
            this.button.innerHTML = '下一次按我是关灯'; 
            this.currState = this.offState; 
        } 
    } 
}; 

var Light = function(){ 
    this.offState = delegate( this, FSM.off ); 
    this.onState = delegate( this, FSM.on ); 
    this.currState = this.offState; // 设置初始状态为关闭状态
    this.button = null; 
}; 

Light.prototype.init = function(){ 
    var button = document.createElement( 'button' ), 
        self = this; 

    button.innerHTML = '已关灯'; 

    this.button = document.body.appendChild( button ); 

    this.button.onclick = function(){
        self.currState.buttonWasPressed(); 
    } 
}; 

var light = new Light(); 
light.init();

/*
    表驱动的有限状态机
    其实还有另外一种实现状态机的方法，这种方法的核心是基于表驱动的。
    我们可以在表中很清楚地看到下一个状态是由当前状态和行为共同决定的。
    这样一来，我们就可以在表中查找状态，而不必定义很多条件分支
 */

// 刚好 GitHub 上有一个对应的库实现，通过这个库，可以很方便地创建出 FSM：
var fsm = StateMachine.create({ 
    initial: 'off', 
    events: [ 
        { name: 'buttonWasPressed', from: 'off', to: 'on' }, 
        { name: 'buttonWasPressed', from: 'on', to: 'off' } 
    ], 
    callbacks: { 
        onbuttonWasPressed: function( event, from, to ){ 
            console.log( arguments ); 
        } 
    }, 
    error: function( eventName, from, to, args, errorCode, errorMessage ) { 
        console.log( arguments ); // 从一种状态试图切换到一种不可能到达的状态的时候 
    } 
}); 

button.onclick = function(){ 
    fsm.buttonWasPressed(); 
}

// 关于这个库的更多内容这里不再赘述，有兴趣的同学可以前往：https://github.com/jakesgordon/javascript-state-machine 学习。

/*
    实际项目中的其他状态机
    在实际开发中，很多场景都可以用状态机来模拟，比如一个下拉菜单在 hover 动作下有显示、悬浮、隐藏等状态；
    一次 TCP 请求有建立连接、监听、关闭等状态；
    一个格斗游戏中人物有攻击、防御、跳跃、跌倒等状态。

    状态机在游戏开发中也有着广泛的用途，特别是游戏 AI 的逻辑编写。
    在我曾经开发的 HTML5 版街头霸王游戏里，游戏主角 Ryu 有走动、攻击、防御、跌倒、跳跃等多种状态。
    这些状态之间既互相联系又互相约束。
    比如 Ryu 在走动的过程中如果被攻击，就会由走动状态切换为跌倒状态。
    在跌倒状态下，Ryu 既不能攻击也不能防御。
    同样，Ryu 也不能在跳跃的过程中切换到防御状态，但是可以进行攻击。
    这种场景就很适合用状态机来描述。
 */

// 代码如下：
var FSM = { 
    walk: { 
        attack: function(){ 
            console.log( '攻击' ); 
        }, 
        defense: function(){ 
            console.log( '防御' ); 
        }, 
        jump: function(){ 
            console.log( '跳跃' ); 
        } 
    }, 

    attack: { 
        walk: function(){ 
            console.log( '攻击的时候不能行走' ); 
        }, 
        defense: function(){ 
            console.log( '攻击的时候不能防御' ); 
        }, 
        jump: function(){ 
            console.log( '攻击的时候不能跳跃' ); 
        } 
    } 
}
