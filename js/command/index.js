/**
 * 命令模式
 * 命令模式的由来，其实是回调（callback）函数的一个面向对象的替代品
 */

/*
    应用场景
    有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么，
    此时希望用一种松耦合的方式来设计软件，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。
 */

// 模拟传统面向对象语言的命令模式实现
var button1 = document.getElementById( 'button1' )
var button2 = document.getElementById( 'button2' )
var button3 = document.getElementById( 'button3' )

// setCommand 函数负责往按钮上面安装命令
// 点击按钮会执行某个 command 命令，执行命令的动作被约定为调用 command 对象的 execute() 方法
var setCommand = function( button, command ){ 
    button.onclick = function(){ 
        command.execute(); 
    } 
};

// 刷新菜单界面、增加子菜单和删除子菜单这几个功能，这几个功能被分布在 MenuBar 和 SubMenu 这两个对象中
var MenuBar = { 
    refresh: function(){ 
        console.log( '刷新菜单目录' ); 
    } 
}; 

var SubMenu = { 
    add: function(){ 
        console.log( '增加子菜单' ); 
    }, 
    del: function(){ 
        console.log( '删除子菜单' ); 
    } 
};

// 在让 button 变得有用起来之前，我们要先把这些行为都封装在命令类中
var RefreshMenuBarCommand = function( receiver ){ 
    this.receiver = receiver; 
}; 

RefreshMenuBarCommand.prototype.execute = function(){ 
    this.receiver.refresh(); 
}; 

var AddSubMenuCommand = function( receiver ){ 
    this.receiver = receiver; 
};
AddSubMenuCommand.prototype.execute = function(){ 
    this.receiver.add(); 
}; 

var DelSubMenuCommand = function( receiver ){ 
    this.receiver = receiver; 
}; 

DelSubMenuCommand.prototype.execute = function(){ 
    console.log( '删除子菜单' ); 
};

// 最后就是把命令接收者传入到 command 对象中，并且把 command 对象安装到 button 上面
var refreshMenuBarCommand = new RefreshMenuBarCommand( MenuBar ); 
var addSubMenuCommand = new AddSubMenuCommand( SubMenu ); 
var delSubMenuCommand = new DelSubMenuCommand( SubMenu ); 

setCommand( button1, refreshMenuBarCommand ); 
setCommand( button2, addSubMenuCommand ); 
setCommand( button3, delSubMenuCommand );



// 在面向对象设计中，命令模式的接收者被当成 command 对象的属性保存起来，同时约定执行命令的操作调用 command.execute 方法。
// 在使用闭包的命令模式实现中，接收者被封闭在闭包产生的环境中，执行命令的操作可以更加简单，仅仅执行回调函数即可。
// 无论接收者被保存为对象的属性，还是被封闭在闭包产生的环境中，在将来执行命令的时候，接收者都能被顺利访问。
// 用闭包实现的命令模式如下代码所示：
var setCommand = function( button, command ){ 
    button.onclick = function(){ 
        command.execute(); 
    } 
}; 

var MenuBar = { 
    refresh: function(){ 
        console.log( '刷新菜单界面' ); 
    } 
}; 

var RefreshMenuBarCommand = function( receiver ){ 
    return {
        execute: function(){ 
            receiver.refresh(); 
        } 
    }
}; 

var refreshMenuBarCommand = RefreshMenuBarCommand( MenuBar ); 

setCommand( button1, refreshMenuBarCommand );



/*
    命令队列
    我们比较关注的问题是，一个动画结束后该如何通知队列。通常可以使用回调函数来通知队列，除了回调函数之外，还可以选择发布-订阅模式。
    即在一个动画结束后发布一个消息，订阅者接收到这个消息之后，便开始执行队列里的下一个动画。
    读者可以尝试按照这个思路来自行实现一个队列动画。
 */

/*
    智能命令与傻瓜命令
    一般来说，命令模式都会在 command 对象中保存一个接收者来负责真正执行客户的请求，这种情况下命令对象是“傻瓜式”的，
    它只负责把客户的请求转交给接收者来执行，这种模式的好处是请求发起者和请求接收者之间尽可能地得到了解耦。

    但是我们也可以定义一些更“聪明”的命令对象，“聪明”的命令对象可以直接实现请求，
    这样一来就不再需要接收者的存在，这种“聪明”的命令对象也叫作智能命令。
    没有接收者的智能命令，退化到和策略模式非常相近，从代码结构上已经无法分辨它们，能分辨的只有它们意图的不同。
    策略模式指向的问题域更小，所有策略对象的目标总是一致的，它们只是达到这个目标的不同手段，它们的内部实现是针对“算法”而言的。
    而智能命令模式指向的问题域更广，command 对象解决的目标更具发散性。
    命令模式还可以完成撤销、排队等功能。
 */
