/**
 * 另一个状态模式示例——文件上传
 */

/*
    接下来我们要讨论一个复杂一点的例子，这原本是一个真实的项目，是我 2013 年重构微云上传模块的经历。
    实际上，不论是文件上传，还是音乐、视频播放器，都可以找到一些明显的状态区分。
    比如文件上传程序中有扫描、正在上传、暂停、上传成功、上传失败这几种状态，音乐播放器可以分为加载中、正在播放、暂停、播放完毕这几种状态。
    点击同一个按钮，在上传中和暂停状态下的行为表现是不一样的，同时它们的样式 class 也不同。
    下面我们以文件上传为例进行说明。
 */

/*
    更复杂的切换条件
    相对于电灯的例子，文件上传不同的地方在于，现在我们将面临更加复杂的条件切换关系。
    在电灯的例子中，电灯的状态总是从关到开再到关，或者从关到弱光、弱光到强光、强光再到关。
    看起来总是循规蹈矩的 A→B→C→A，所以即使不使用状态模式来编写电灯的程序，而是使用原始的 if、else 来控制状态切换，
    我们也不至于在逻辑编写中迷失自己，因为状态的切换总是遵循一些简单的规律，代码如下：

        if ( this.state === 'off' ){ 
            console.log( '开弱光' ); 
            this.button.innerHTML = '下一次按我是强光'; 
            this.state = 'weakLight'; 
        }else if ( this.state === 'weakLight' ){ 
            console.log( '开强光' ); 
            this.button.innerHTML = '下一次按我是关灯'; 
            this.state = 'strongLight'; 
        }else if ( this.state === 'strongLight' ){ 
            console.log( '关灯' ); 
            this.button.innerHTML = '下一次按我是弱光'; 
            this.state = 'off'; 
        }

    而文件上传的状态切换相比要复杂得多，控制文件上传的流程需要两个节点按钮，第一个用于暂停和继续上传，第二个用于删除文件

    现在看看文件在不同的状态下，点击这两个按钮将分别发生什么行为。

        文件在扫描状态中，是不能进行任何操作的，既不能暂停也不能删除文件，只能等待扫描完成。
        扫描完成之后，根据文件的 md5 值判断，若确认该文件已经存在于服务器，则直接跳到上传完成状态。
        如果该文件的大小超过允许上传的最大值，或者该文件已经损坏，则跳往上传失败状态。
        剩下的情况下才进入上传中状态。

        上传过程中可以点击暂停按钮来暂停上传，暂停后点击同一个按钮会继续上传。

        扫描和上传过程中，点击删除按钮无效，只有在暂停、上传完成、上传失败之后，才能删除文件。
 */

/*
    一些准备工作
    微云提供了一些浏览器插件来帮助完成文件上传。
    插件类型根据浏览器的不同，有可能是 ActiveObject，也有可能是 WebkitPlugin。

    上传是一个异步的过程，所以控件会不停地调用 JavaScript 提供的一个全局函数 window.external.upload，
    来通知 JavaScript 目前的上传进度，控件会把当前的文件状态作为参数 state 塞进 window.external.upload。
 */

// 在这里无法提供一个完整的上传插件，我们将简单地用 setTimeout 来模拟文件的上传进度，
// window.external.upload 函数在此例中也只负责打印一些 log：
window.external.upload = function( state ){ 
    console.log( state ); // 可能为 sign、uploading、done、error 
};

// 另外我们需要在页面中放置一个用于上传的插件对象：
var plugin = (function(){
    var plugin = document.createElement( 'embed' ); 
        plugin.style.display = 'none'; 

    plugin.type = 'application/txftn-webkit'; 

    plugin.sign = function(){ 
        console.log( '开始文件扫描' ); 
    } 

    plugin.pause = function(){ 
        console.log( '暂停文件上传' ); 
    }; 

    plugin.uploading = function(){ 
        console.log( '开始文件上传' ); 
    }; 

    plugin.del = function(){ 
        console.log( '删除文件上传' ); 
    } 

    plugin.done = function(){ 
        console.log( '文件上传完成' ); 
    } 

    document.body.appendChild( plugin ); 

    return plugin; 
})();

// 接下来开始完成其他代码的编写，先定义 Upload 类，控制上传过程的对象将从 Upload 类中创建而来：
var Upload = function( fileName ){ 
    this.plugin = plugin; 
    this.fileName = fileName; 
    this.button1 = null; 
    this.button2 = null; 
    this.state = 'sign'; // 设置初始状态为 waiting 
};

// Upload.prototype.init 方法会进行一些初始化工作，包括创建页面中的一些节点。
// 在这些节点里，起主要作用的是两个用于控制上传流程的按钮，第一个按钮用于暂停和继续上传，第二个用于删除文件：
Upload.prototype.init = function(){ 
    var that = this; 

    this.dom = document.createElement( 'div' ); 
    this.dom.innerHTML = 
        '<span>文件名称:'+ this.fileName +'</span>\ <button data-action="button1">扫描中</button>\ <button data-action="button2">删除</button>'; 

    document.body.appendChild( this.dom ); 

    this.button1 = this.dom.querySelector( '[data-action="button1"]' ); // 第一个按钮
    this.button2 = this.dom.querySelector( '[data-action="button2"]' ); // 第二个按钮

    this.bindEvent(); 
};

// 接下来需要给两个按钮分别绑定点击事件：
Upload.prototype.bindEvent = function(){ 
    var self = this; 
    this.button1.onclick = function(){ 
        if ( self.state === 'sign' ){ // 扫描状态下，任何操作无效
            console.log( '扫描中，点击无效...' ); 
        }else if ( self.state === 'uploading' ){ // 上传中，点击切换到暂停
            self.changeState( 'pause' ); 
        }else if ( self.state === 'pause' ){ // 暂停中，点击切换到上传中
            self.changeState( 'uploading' ); 
        }else if ( self.state === 'done' ){ 
            console.log( '文件已完成上传, 点击无效' ); 
        }else if ( self.state === 'error' ){ 
            console.log( '文件上传失败, 点击无效' ); 
        } 
    }; 

    this.button2.onclick = function(){ 
        if ( self.state === 'done' || self.state === 'error' || self.state === 'pause' ){ 
            // 上传完成、上传失败和暂停状态下可以删除
            self.changeState( 'del' ); 
        }else if ( self.state === 'sign' ){ 
            console.log( '文件正在扫描中，不能删除' ); 
        }else if ( self.state === 'uploading' ){ 
            console.log( '文件正在上传中，不能删除' ); 
        } 
    }; 
};

// 再接下来是 Upload.prototype.changeState 方法，它负责切换状态之后的具体行为，包括改变按钮的 innerHTML，以及调用插件开始一些“真正”的操作：
Upload.prototype.changeState = function( state ){ 
    switch( state ){
        case 'sign': 
            this.plugin.sign(); 
            this.button1.innerHTML = '扫描中，任何操作无效'; 
            break; 
        case 'uploading': 
            this.plugin.uploading(); 
            this.button1.innerHTML = '正在上传，点击暂停'; 
            break; 
        case 'pause': 
            this.plugin.pause(); 
            this.button1.innerHTML = '已暂停，点击继续上传'; 
            break; 
        case 'done': 
            this.plugin.done(); 
            this.button1.innerHTML = '上传完成'; 
            break; 
        case 'error': 
            this.button1.innerHTML = '上传失败'; 
            break; 
        case 'del': 
            this.plugin.del(); 
            this.dom.parentNode.removeChild( this.dom ); 
            console.log( '删除完成' ); 
            break; 
    } 

    this.state = state; 
};

// 最后我们来进行一些测试工作：
var uploadObj = new Upload( 'JavaScript 设计模式与开发实践' ); 

uploadObj.init(); 

window.external.upload = function( state ){ // 插件调用 JavaScript 的方法
    uploadObj.changeState( state ); 
}; 

window.external.upload( 'sign' ); // 文件开始扫描

setTimeout(function(){ 
    window.external.upload( 'uploading' ); // 1 秒后开始上传
}, 1000 ); 

setTimeout(function(){ 
    window.external.upload( 'done' ); // 5 秒后上传完成
}, 5000 );

/*
    至此就完成了一个简单的文件上传程序的编写。
    当然这仍然是一个反例，这里的缺点跟电灯例子中的第一段代码一样，程序中充斥着 if、else 条件分支，
    状态和行为都被耦合在一个巨大的方法里，我们很难修改和扩展这个状态机。
    文件状态之间的联系如此复杂，这个问题显得更加严重了。
 */

/*
    状态模式重构文件上传程序
    状态模式在文件上传的程序中，是最优雅的解决办法之一。
    通过电灯的例子，我们已经熟知状态模式的结构了，下面就开始一步步地重构它。
 */

// 第一步仍然是提供 window.external.upload 函数，在页面中模拟创建上传插件，这部分代码没有改变：
window.external.upload = function( state ){ 
    console.log( state ); // 可能为 sign、uploading、done、error 
};

var plugin = (function(){
    var plugin = document.createElement( 'embed' ); 
        plugin.style.display = 'none'; 

    plugin.type = 'application/txftn-webkit'; 

    plugin.sign = function(){ 
        console.log( '开始文件扫描' ); 
    } 

    plugin.pause = function(){ 
        console.log( '暂停文件上传' ); 
    }; 

    plugin.uploading = function(){ 
        console.log( '开始文件上传' ); 
    }; 

    plugin.del = function(){ 
        console.log( '删除文件上传' ); 
    } 

    plugin.done = function(){ 
        console.log( '文件上传完成' ); 
    } 

    document.body.appendChild( plugin ); 

    return plugin; 
})();

// 第二步，改造 Upload 构造函数，在构造函数中为每种状态子类都创建一个实例对象：
var Upload = function( fileName ){ 
    this.plugin = plugin; 
    this.fileName = fileName; 
    this.button1 = null; 
    this.button2 = null; 
    this.signState = new SignState( this ); // 设置初始状态为 waiting 
    this.uploadingState = new UploadingState( this );
    this.pauseState = new PauseState( this ); 
    this.doneState = new DoneState( this ); 
    this.errorState = new ErrorState( this ); 
    this.currState = this.signState; // 设置当前状态
};

// 第三步，Upload.prototype.init 方法无需改变，仍然负责往页面中创建跟上传流程有关的 DOM 节点，并开始绑定按钮的事件：
Upload.prototype.init = function(){ 
    var that = this; 

    this.dom = document.createElement( 'div' ); 
    this.dom.innerHTML = 
        '<span>文件名称:'+ this.fileName +'</span>\ <button data-action="button1">扫描中</button>\ <button data-action="button2">删除</button>'; 

    document.body.appendChild( this.dom ); 

    this.button1 = this.dom.querySelector( '[data-action="button1"]' ); // 第一个按钮
    this.button2 = this.dom.querySelector( '[data-action="button2"]' ); // 第二个按钮

    this.bindEvent(); 
};

// 第四步，负责具体的按钮事件实现，在点击了按钮之后，Context 并不做任何具体的操作，而是把请求委托给当前的状态类来执行：
Upload.prototype.bindEvent = function(){ 
    var self = this; 

    this.button1.onclick = function(){ 
        self.currState.clickHandler1(); 
    } 

    this.button2.onclick = function(){ 
        self.currState.clickHandler2(); 
    } 
};

// 第四步中的代码有一些变化，我们把状态对应的逻辑行为放在 Upload 类中：
Upload.prototype.sign = function(){ 
    this.plugin.sign(); 
    this.currState = this.signState; 
}; 

Upload.prototype.uploading = function(){ 
    this.button1.innerHTML = '正在上传，点击暂停'; 
    this.plugin.uploading(); 
    this.currState = this.uploadingState; 
}; 

Upload.prototype.pause = function(){
    this.button1.innerHTML = '已暂停，点击继续上传'; 
    this.plugin.pause(); 
    this.currState = this.pauseState; 
}; 

Upload.prototype.done = function(){ 
    this.button1.innerHTML = '上传完成'; 
    this.plugin.done(); 
    this.currState = this.doneState; 
}; 

Upload.prototype.error = function(){ 
    this.button1.innerHTML = '上传失败'; 
    this.currState = this.errorState; 
}; 

Upload.prototype.del = function(){ 
    this.plugin.del(); 
    this.dom.parentNode.removeChild( this.dom ); 
};

// 第五步，工作略显乏味，我们要编写各个状态类的实现。
// 值得注意的是，我们使用了 StateFactory，从而避免因为 JavaScript 中没有抽象类所带来的问题。
var StateFactory = (function(){ 
    var State = function(){}; 

    State.prototype.clickHandler1 = function(){ 
        throw new Error( '子类必须重写父类的 clickHandler1 方法' ); 
    } 

    State.prototype.clickHandler2 = function(){ 
        throw new Error( '子类必须重写父类的 clickHandler2 方法' ); 
    } 

    return function( param ){ 
        var F = function( uploadObj ){ 
            this.uploadObj = uploadObj; 
        }; 

        F.prototype = new State(); 

        for ( var i in param ){ 
            F.prototype[ i ] = param[ i ]; 
        } 

        return F; 
    } 
})();

var SignState = StateFactory({
    clickHandler1: function(){ 
        console.log( '扫描中，点击无效...' ); 
    }, 
    clickHandler2: function(){ 
        console.log( '文件正在上传中，不能删除' ); 
    } 
}); 

var UploadingState = StateFactory({ 
    clickHandler1: function(){ 
        this.uploadObj.pause(); 
    }, 
    clickHandler2: function(){ 
        console.log( '文件正在上传中，不能删除' ); 
    } 
}); 

var PauseState = StateFactory({ 
    clickHandler1: function(){ 
        this.uploadObj.uploading(); 
    }, 
    clickHandler2: function(){ 
        this.uploadObj.del(); 
    } 
}); 

var DoneState = StateFactory({ 
    clickHandler1: function(){ 
        console.log( '文件已完成上传, 点击无效' ); 
    }, 
    clickHandler2: function(){ 
        this.uploadObj.del(); 
    } 
}); 

var ErrorState = StateFactory({ 
    clickHandler1: function(){ 
        console.log( '文件上传失败, 点击无效' ); 
    }, 
    clickHandler2: function(){ 
        this.uploadObj.del(); 
    } 
});

// 最后是测试时间：
var uploadObj = new Upload( 'JavaScript 设计模式与开发实践' ); 
uploadObj.init(); 

window.external.upload = function( state ){ 
    uploadObj[ state ](); 
}; 

window.external.upload( 'sign' );

setTimeout(function(){ 
    window.external.upload( 'uploading' ); // 1 秒后开始上传
}, 1000 ); 

setTimeout(function(){ 
    window.external.upload( 'done' ); // 5 秒后上传完成
}, 5000 );