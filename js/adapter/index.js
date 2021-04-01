/**
 * 适配器模式
 * 适配器模式的作用是解决两个软件实体间的接口不兼容的问题。使用适配器模式之后，原本由于接口不兼容而不能工作的两个软件实体可以一起工作。
 */

/*
    现实中的适配器
        1. 港式插头转换器
        2. 电源适配器
        3. USB 转接口
 */

/*
    适配器模式的应用
    如果现有的接口已经能够正常工作，那我们就永远不会用上适配器模式。
    适配器模式是一种“亡羊补牢”的模式，没有人会在程序的设计之初就使用它。
    因为没有人可以完全预料到未来的事情，也许现在好好工作的接口，
    未来的某天却不再适用于新系统，那么我们可以用适配器模式把旧接口包装成一个新的接口，使它继续保持生命力。
    比如在 JSON 格式流行之前，很多 cgi 返回的都是 XML 格式的数据，
    如果今天仍然想继续使用这些接口，显然我们可以创造一个 XML-JSON 的适配器。
 */

// 回忆 1.3 节中多态的例子，当我们向 googleMap 和 baiduMap 都发出“显示”请求时，googleMap 和 baiduMap 分别以各自的方式在页面中展现了地图：
var googleMap = { 
    show: function(){ 
        console.log( '开始渲染谷歌地图' ); 
    } 
}; 

var baiduMap = { 
    show: function(){ 
        console.log( '开始渲染百度地图' ); 
    } 
}; 

var renderMap = function( map ){ 
    if ( map.show instanceof Function ){ 
        map.show(); 
    } 
};

renderMap( googleMap ); // 输出：开始渲染谷歌地图 
renderMap( baiduMap ); // 输出：开始渲染百度地图

/*
    这段程序得以顺利运行的关键是 googleMap 和 baiduMap 提供了一致的 show 方法，但第三方的接口方法并不在我们自己的控制范围之内，
    假如 baiduMap 提供的显示地图的方法不叫 show 而叫 display 呢？
 */

// baiduMap 这个对象来源于第三方，正常情况下我们都不应该去改动它。
// 此时我们可以通过增加 baiduMapAdapter 来解决问题：
var googleMap = { 
    show: function(){ 
        console.log( '开始渲染谷歌地图' ); 
    } 
}; 

var baiduMap = { 
    display: function(){ 
        console.log( '开始渲染百度地图' ); 
    } 
}; 

var baiduMapAdapter = { 
    show: function(){ 
        return baiduMap.display();
    } 
}; 

renderMap( googleMap ); // 输出：开始渲染谷歌地图
renderMap( baiduMapAdapter ); // 输出：开始渲染百度地图

// 再来看看另外一个例子。假设我们正在编写一个渲染广东省地图的页面。
// 目前从第三方资源里获得了广东省的所有城市以及它们所对应的 ID，并且成功地渲染到页面中：
var getGuangdongCity = function(){ 
    var guangdongCity = [ 
        { 
            name: 'shenzhen', 
            id: 11, 
        }, 
        { 
            name: 'guangzhou', 
            id: 12, 
        } 
    ]; 
    return guangdongCity; 
}; 

var render = function( fn ){ 
    console.log( '开始渲染广东省地图' ); 
    document.write( JSON.stringify( fn() ) ); 
}; 

render( getGuangdongCity );

// 利用这些数据，我们编写完成了整个页面，并且在线上稳定地运行了一段时间。
// 但后来发现这些数据不太可靠，里面还缺少很多城市。
// 于是我们又在网上找到了另外一些数据资源，这次的数据更加全面，但遗憾的是，数据结构和正运行在项目中的并不一致。
// 新的数据结构如下：
var guangdongCity = { 
    shenzhen: 11, 
    guangzhou: 12, 
    zhuhai: 13 
};

// 除了大动干戈地改写渲染页面的前端代码之外，另外一种更轻便的解决方式就是新增一个数据格式转换的适配器：
var getGuangdongCity = function(){ 
    var guangdongCity = [ 
        { 
            name: 'shenzhen', 
            id: 11, 
        }, 
        { 
            name: 'guangzhou', 
            id: 12, 
        } 
    ]; 
    return guangdongCity; 
}; 

var render = function( fn ){ 
    console.log( '开始渲染广东省地图' ); 
    document.write( JSON.stringify( fn() ) ); 
}; 

var addressAdapter = function( oldAddressfn ){ 
    var address = {}, 
        oldAddress = oldAddressfn(); 

    for ( var i = 0, c; c = oldAddress[ i++ ]; ){ 
        address[ c.name ] = c.id; 
    } 

    return function(){ 
        return address; 
    } 
}; 

render( addressAdapter( getGuangdongCity ) );

// 那么接下来需要做的，就是把代码中调用 getGuangdongCity 的地方，用经过 addressAdapter 适配器转换之后的新函数来代替。

/*
    适配器模式是一对相对简单的模式。
    在本书提到的设计模式中，有一些模式跟适配器模式的结构非常相似，比如装饰者模式、代理模式和外观模式（参见第 19 章）。
    这几种模式都属于“包装模式”，都是由一个对象来包装另一个对象。区别它们的关键仍然是模式的意图。

        适配器模式主要用来解决两个已有接口之间不匹配的问题，它不考虑这些接口是怎样实现的，也不考虑它们将来可能会如何演化。
        适配器模式不需要改变已有的接口，就能够使它们协同作用。

        装饰者模式和代理模式也不会改变原有对象的接口，但装饰者模式的作用是为了给对象增加功能。
        装饰者模式常常形成一条长的装饰链，而适配器模式通常只包装一次。
        代理模式是为了控制对对象的访问，通常也只包装一次。

        外观模式的作用倒是和适配器比较相似，有人把外观模式看成一组对象的适配器，但外观模式最显著的特点是定义了一个新的接口。
 */