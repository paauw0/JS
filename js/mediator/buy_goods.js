/**
 * 中介者模式的例子——购买商品
 */

/*
    假设我们正在编写一个手机购买的页面，在购买流程中，可以选择手机的颜色以及输入购买数量，
    同时页面中有两个展示区域，分别向用户展示刚刚选择好的颜色和数量。
    还有一个按钮动态显示下一步的操作，我们需要查询该颜色手机对应的库存，
    如果库存数量少于这次的购买数量，按钮将被禁用并且显示库存不足，反之按钮可以点击并且显示放入购物车。
 */

// 这个需求是非常容易实现的，假设我们已经提前从后台获取到了所有颜色手机的库存量：
var goods = { // 手机库存
    "red": 3, 
    "blue": 6 
};

/*
    那么页面有可能显示为如下几种场景：
        选择红色手机，购买 4 个，库存不足。
        选择蓝色手机，购买 5 个，库存充足，可以加入购物车。
        或者是没有输入购买数量的时候，按钮将被禁用并显示相应提示。

    我们大概已经能够猜到，接下来将遇到至少 5 个节点，分别是：
        下拉选择框 colorSelect
        文本输入框 numberInput
        展示颜色信息 colorInfo
        展示购买数量信息 numberInfo
        决定下一步操作的按钮 nextBtn
 */

// 分别监听 colorSelect 的 onchange 事件函数和 numberInput 的 oninput 事件函数，然后在这两个事件中作出相应处理。
var colorSelect = document.getElementById( 'colorSelect' ), 
    numberInput = document.getElementById( 'numberInput' ), 
    colorInfo = document.getElementById( 'colorInfo' ), 
    numberInfo = document.getElementById( 'numberInfo' ), 
    nextBtn = document.getElementById( 'nextBtn' );

var goods = { // 手机库存
    "red": 3, 
    "blue": 6 
};

colorSelect.onchange = function(){ 
    var color = this.value, // 颜色
    number = numberInput.value, // 数量
    stock = goods[ color ]; // 该颜色手机对应的当前库存

    colorInfo.innerHTML = color;

    if ( !color ){ 
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请选择手机颜色'; 
        return; 
    } 

    if ( ( ( number - 0 ) | 0 ) !== number - 0 ){ // 用户输入的购买数量是否为正整数
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请输入正确的购买数量'; 
        return; 
    } 

    if ( number > stock ){ // 当前选择数量没有超过库存量
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '库存不足'; 
        return ; 
    } 

    nextBtn.disabled = false; 
    nextBtn.innerHTML = '放入购物车'; 
};

/*
    对象之间的联系
    来考虑一下，当触发了 colorSelect 的 onchange 之后，会发生什么事情。

    首先我们要让 colorInfo 中显示当前选中的颜色，然后获取用户当前输入的购买数量，
    对用户的输入值进行一些合法性判断。再根据库存数量来判断 nextBtn 的显示状态。
 */

// 别忘了，我们还要编写 numberInput 的事件相关代码：
numberInput.oninput = function(){
    var color = colorSelect.value, // 颜色
    number = this.value, // 数量
    stock = goods[ color ]; // 该颜色手机对应的当前库存

    numberInfo.innerHTML = number; 

    if ( !color ){ 
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请选择手机颜色'; 
        return; 
    } 

    if ( ( ( number - 0 ) | 0 ) !== number - 0 ){ // 输入购买数量是否为正整数
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请输入正确的购买数量'; 
        return; 
    }

    if ( number > stock ){ // 当前选择数量没有超过库存量
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '库存不足'; 
        return ; 
    } 

    nextBtn.disabled = false; 
    nextBtn.innerHTML = '放入购物车'; 
};

/*
    可能遇到的困难
    虽然目前顺利完成了代码编写，但随之而来的需求改变有可能给我们带来麻烦。
    假设现在要求去掉 colorInfo 和 numberInfo 这两个展示区域，我们就要分别改动 colorSelect.onchange 和 numberInput.onput 里面的代码，
    因为在先前的代码中，这些对象确实是耦合在一起的。

    目前我们面临的对象还不算太多，当这个页面里的节点激增到 10 个或者 15 个时，它们之间的联系可能变得更加错综复杂，任何一次改动都将变得很棘手。
    为了证实这一点，我们假设页面中将新增另外一个下拉选择框，代表选择手机内存。
    现在我们需要计算颜色、内存和购买数量，来判断 nextBtn 是显示库存不足还是放入购物车。
 */

// 首先我们要增加两个 HTML 节点：
var colorSelect = document.getElementById( 'colorSelect' ), 
    numberInput = document.getElementById( 'numberInput' ), 
    memorySelect = document.getElementById( 'memorySelect' ),
    colorInfo = document.getElementById( 'colorInfo' ), 
    numberInfo = document.getElementById( 'numberInfo' ), 
    memoryInfo = document.getElementById( 'memoryInfo' ),
    nextBtn = document.getElementById( 'nextBtn' );

// 接下来修改表示存库的 JSON 对象以及修改 colorSelect 的 onchange 事件函数：
var goods = { // 手机库存
    "red|32G": 3, // 红色 32G，库存数量为 3 
    "red|16G": 0, 
    "blue|32G": 1, 
    "blue|16G": 6 
};

colorSelect.onchange = function(){ 
    var color = this.value, 
    memory = memorySelect.value, 
    stock = goods[ color + '|' + memory ]; 
    
    number = numberInput.value, // 数量
    colorInfo.innerHTML = color; 

    if ( !color ){ 
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请选择手机颜色'; 
        return; 
    } 

    if ( !memory ){ 
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请选择内存大小'; 
        return; 
    } 

    if ( ( ( number - 0 ) | 0 ) !== number - 0 ){ // 输入购买数量是否为正整数
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请输入正确的购买数量'; 
        return; 
    } 

    if ( number > stock ){ // 当前选择数量没有超过库存量
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '库存不足'; 
        return ; 
    } 

    nextBtn.disabled = false; 
    nextBtn.innerHTML = '放入购物车'; 
};

// 当然我们同样要改写 numberInput 的事件相关代码，具体代码的改变跟 colorSelect 大同小异，读者可以自行实现。
numberInput.oninput = function(){
    var color = colorSelect.value, // 颜色
    number = this.value, // 数量
    memory = memorySelect.value,
    stock = goods[ color + '|' + memory ]; // 该颜色手机对应的当前库存

    numberInfo.innerHTML = number; 

    if ( !color ){ 
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请选择手机颜色'; 
        return; 
    } 

    if ( !memory ){ 
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请选择内存大小'; 
        return; 
    } 

    if ( ( ( number - 0 ) | 0 ) !== number - 0 ){ // 输入购买数量是否为正整数
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请输入正确的购买数量'; 
        return; 
    }

    if ( number > stock ){ // 当前选择数量没有超过库存量
        console.log(1111)
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '库存不足'; 
        return ; 
    } 

    nextBtn.disabled = false; 
    nextBtn.innerHTML = '放入购物车'; 
};

// 最后还要新增 memorySelect 的 onchange 事件函数：
memorySelect.onchange = function(){ 
    var color = colorSelect.value, // 颜色
    number = numberInput.value, // 数量
    memory = this.value, 
    stock = goods[ color + '|' + memory ]; // 该颜色手机对应的当前库存

    memoryInfo.innerHTML = memory; 

    if ( !color ){ 
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请选择手机颜色'; 
        return; 
    } 

    if ( !memory ){ 
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请选择内存大小'; 
        return; 
    } 

    if ( ( ( number - 0 ) | 0 ) !== number - 0 ){ // 输入购买数量是否为正整数
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '请输入正确的购买数量'; 
        return; 
    } 

    if ( number > stock ){ // 当前选择数量没有超过库存量
        nextBtn.disabled = true; 
        nextBtn.innerHTML = '库存不足'; 
        return ; 
    } 

    nextBtn.disabled = false; 
    nextBtn.innerHTML = '放入购物车'; 
};

/*
    很遗憾，我们仅仅是增加一个内存的选择条件，就要改变如此多的代码，
    这是因为在目前的实现中，每个节点对象都是耦合在一起的，改变或者增加任何一个节点对象，都要通知到与其相关的对象。
 */

/*
    引入中介者
    现在我们来引入中介者对象，所有的节点对象只跟中介者通信。
    当下拉选择框 colorSelect、memorySelect 和文本输入框 numberInput 发生了事件行为时，它们仅仅通知中介者它们被改变了，
    同时把自身当作参数传入中介者，以便中介者辨别是谁发生了改变。
    剩下的所有事情都交给中介者对象来完成，这样一来，无论是修改还是新增节点，都只需要改动中介者对象里的代码。
 */

var goods = { // 手机库存
    "red|32G": 3, 
    "red|16G": 0, 
    "blue|32G": 1, 
    "blue|16G": 6 
};

var mediator = (function(){ 
    var colorSelect = document.getElementById( 'colorSelect' ), 
        memorySelect = document.getElementById( 'memorySelect' ), 
        numberInput = document.getElementById( 'numberInput' ), 
        colorInfo = document.getElementById( 'colorInfo' ), 
        memoryInfo = document.getElementById( 'memoryInfo' ), 
        numberInfo = document.getElementById( 'numberInfo' ), 
        nextBtn = document.getElementById( 'nextBtn' ); 

    return { 
        changed: function( obj ){ 
            var color = colorSelect.value, // 颜色
            memory = memorySelect.value,// 内存
            number = numberInput.value, // 数量
            stock = goods[ color + '|' + memory ]; // 颜色和内存对应的手机库存数量

            if ( obj === colorSelect ){ // 如果改变的是选择颜色下拉框
                colorInfo.innerHTML = color; 
            }else if ( obj === memorySelect ){ 
                memoryInfo.innerHTML = memory; 
            }else if ( obj === numberInput ){ 
                numberInfo.innerHTML = number; 
            } 

            if ( !color ){ 
                nextBtn.disabled = true; 
                nextBtn.innerHTML = '请选择手机颜色'; 
                return; 
            } 

            if ( !memory ){ 
                nextBtn.disabled = true; 
                nextBtn.innerHTML = '请选择内存大小'; 
                return; 
            } 

            if ( ( ( number - 0 ) | 0 ) !== number - 0 ){ // 输入购买数量是否为正整数
                nextBtn.disabled = true; 
                nextBtn.innerHTML = '请输入正确的购买数量'; 
                return; 
            } 

            nextBtn.disabled = false; 
            nextBtn.innerHTML = '放入购物车'; 
        }
    } 
})(); 

// 事件函数：
colorSelect.onchange = function(){ 
    mediator.changed( this ); 
}; 

memorySelect.onchange = function(){ 
    mediator.changed( this ); 
}; 

numberInput.oninput = function(){ 
    mediator.changed( this ); 
};

// 可以想象，某天我们又要新增一些跟需求相关的节点，比如 CPU 型号，那我们只需要稍稍改动 mediator 对象即可：
var goods = { // 手机库存
    "red|32G|800": 3, // 颜色 red，内存 32G，cpu800，对应库存数量为 3 
    "red|16G|801": 0, 
    "blue|32G|800": 1, 
    "blue|16G|801": 6 
};

var mediator = (function(){ 
    // 略
    var cpuSelect = document.getElementById( 'cpuSelect' ); 

    return { 
        change: function(obj){ 
        // 略
        var cpu = cpuSelect.value, 
        stock = goods[ color + '|' + memory + '|' + cpu ]; 

        if ( obj === cpuSelect ){ 
            cpuInfo.innerHTML = cpu; 
        } 
        // 略
        } 
    } 
})();