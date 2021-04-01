/**
 * 使用策略模式实现缓动动画
 */

// 一些常见的缓动算法
// 这些算法都接受 4 个参数，这 4 个参数的含义分别是
// 动画已消耗的时间、小球原始位置、小球目标位置、动画持续的总时间，
// 返回的值则是动画元素应该处在的当前位置。
var tween = { 
    linear: function( t, b, c, d ){ 
        return c * t / d + b; 
    }, 
    easeIn: function( t, b, c, d ){ 
        return c * ( t /= d ) * t + b; 
    },
    strongEaseIn: function( t, b, c, d ){ 
        return c * ( t /= d ) * t * t * t * t + b; 
    }, 
    strongEaseOut: function( t, b, c, d ){ 
        return c * ( ( t = t / d - 1 ) * t * t * t * t + 1 ) + b; 
    }, 
    sineaseIn: function( t, b, c, d ){ 
        return c * ( t /= d ) * t * t + b; 
    }, 
    sineaseOut: function( t, b, c, d ){ 
        return c * ( ( t = t / d - 1 ) * t * t + 1 ) + b; 
    } 
};

// 代码的思想来自 jQuery 库，由于目标是演示策略模式，而非编写一个完整的动画库，因此我们省去了动画的队列控制等更多完整功能。

// 定义 Animate 类，Animate 的构造函数接受一个参数：即将运动起来的 dom 节点。
var Animate = function( dom ){ 
    this.dom = dom; // 进行运动的 dom 节点
    this.startTime = 0; // 动画开始时间
    this.startPos = 0; // 动画开始时，dom 节点的位置，即 dom 的初始位置
    this.endPos = 0; // 动画结束时，dom 节点的位置，即 dom 的目标位置
    this.propertyName = null; // dom 节点需要被改变的 css 属性名
    this.easing = null; // 缓动算法
    this.duration = null; // 动画持续时间
};

// Animate.prototype.start 方法负责启动这个动画，在动画被启动的瞬间，要记录一些信息，供缓动算法在以后计算小球当前位置的时候使用。
// 在记录完这些信息之后，此方法还要负责启动定时器。

// Animate.prototype.start 方法接受以下 4 个参数。
// propertyName：要改变的 CSS 属性名，比如'left'、'top'，分别表示左右移动和上下移动。
// endPos： 小球运动的目标位置。
// duration： 动画持续时间。
// easing： 缓动算法。
Animate.prototype.start = function( propertyName, endPos, duration, easing ){ 
    this.startTime = +new Date; // 动画启动时间
    this.startPos = this.dom.getBoundingClientRect()[ propertyName ]; // dom 节点初始位置
    this.propertyName = propertyName; // dom 节点需要被改变的 CSS 属性名
    this.endPos = endPos; // dom 节点目标位置
    this.duration = duration; // 动画持续时间
    this.easing = tween[ easing ]; // 缓动算法
    var self = this; 
    var timeId = setInterval(function(){ // 启动定时器，开始执行动画
        if ( self.step() === false ){ // 如果动画已结束，则清除定时器
            clearInterval( timeId );
        } 
    }, 19 ); 
};

// Animate.prototype.step 方法，该方法代表小球运动的每一帧要做的事情。
// 在此处，这个方法负责计算小球的当前位置和调用更新 CSS 属性值的方法 Animate.prototype.update。
Animate.prototype.step = function(){ 
    var t = +new Date; // 取得当前时间
    // 如果当前时间大于动画开始时间加上动画持续时间之和，说明动画已经结束，此时要修正小球的位置。
    // 因为在这一帧开始之后，小球的位置已经接近了目标位置，但很可能不完全等于目标位置。
    // 此时我们要主动修正小球的当前位置为最终的目标位置。
    // 此外让 Animate.prototype.step 方法返回 false，可以通知 Animate.prototype.start 方法清除定时器。
    if ( t >= this.startTime + this.duration ){
        this.update( this.endPos ); // 更新小球的 CSS 属性值
        return false; 
    } 
    var pos = this.easing( t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration ); 
    // pos 为小球当前位置
    this.update( pos ); // 更新小球的 CSS 属性值
};

// 更新小球 CSS 属性值的 Animate.prototype.update 方法
Animate.prototype.update = function( pos ){ 
    this.dom.style[ this.propertyName ] = pos + 'px'; 
};

// 测试
var div = document.getElementById( 'div' ); 
var animate = new Animate( div ); 
animate.start( 'left', 500, 1000, 'strongEaseOut' ); 
// animate.start( 'top', 1500, 500, 'strongEaseIn' );