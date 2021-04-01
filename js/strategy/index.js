/**
 * 策略模式
 * 策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。
 */

/*
    一个基于策略模式的程序至少由两部分组成。
    第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。
    第二个部分是环境类 Context，Context 接受客户的请求，随后把请求委托给某一个策略类。
    要做到这点，说明 Context 中要维持对某个策略对象的引用。
 */

/*
    策略模式的优缺点
    优点
    策略模式利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择语句。
    策略模式提供了对开放—封闭原则的完美支持，将算法封装在独立的 strategy 中，使得它们易于切换，易于理解，易于扩展。
    策略模式中的算法也可以复用在系统的其他地方，从而避免许多重复的复制粘贴工作。
    在策略模式中利用组合和委托来让 Context 拥有执行算法的能力，这也是继承的一种更轻便的替代方案。
    缺点
    使用策略模式会在程序中增加许多策略类或者策略对象，但实际上这比把它们负责的逻辑堆砌在 Context 中要好。
    要使用策略模式，必须了解所有的 strategy，必须了解各个 strategy 之间的不同点，这样才能选择一个合适的 strategy。
 */

/**
 * 使用策略模式计算奖金
 */
var strategies = { 
    "S": function( salary ){ 
        return salary * 4; 
    }, 
    "A": function( salary ){ 
        return salary * 3; 
    }, 
    "B": function( salary ){ 
        return salary * 2; 
    } 
};

var calculateBonus = function( level, salary ){ 
    return strategies[ level ]( salary ); 
}; 
console.log( calculateBonus( 'S', 20000 ) ); // 输出：80000 
console.log( calculateBonus( 'A', 10000 ) ); // 输出：30000