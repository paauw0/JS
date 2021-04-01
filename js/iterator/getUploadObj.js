/**
 * 迭代器模式的应用举例
 */

/*
    下面这段代码，它的目的是根据不同的浏览器获取相应的上传组件对象：
 */

var getUploadObj = function(){ 
    try{ 
        return new ActiveXObject("TXFTNActiveX.FTNUpload"); // IE 上传控件
    }catch(e){ 
        if ( supportFlash() ){ // supportFlash 函数未提供
            var str = '<object type="application/x-shockwave-flash"></object>'; 
            return $( str ).appendTo( $('body') ); 
        }else{ 
            var str = '<input name="file" type="file"/>'; // 表单上传
            return $( str ).appendTo( $('body') );
        } 
    } 
};

/*
    在不同的浏览器环境下，选择的上传方式是不一样的。
    因为使用浏览器的上传控件进行上传速度快，可以暂停和续传，所以我们首先会优先使用控件上传。
    如果浏览器没有安装上传控件，则使用 Flash 上传， 如果连 Flash 也没安装，那就只好使用浏览器原生的表单上传了。

    看看上面的代码，为了得到一个 upload 对象，这个 getUploadObj 函数里面充斥了 try，catch 以及 if 条件分支。
    缺点是显而易见的。第一是很难阅读，第二是严重违反开闭原则。 
    在开发和调试过程中，我们需要来回切换不同的上传方式，每次改动都相当痛苦。
    后来我们还增加支持了一些另外的上传方式，比如，HTML5 上传，这时候唯一的办法是继续往 getUploadObj 函数里增加条件分支。

    现在来梳理一下问题，目前一共有 3 种可能的上传方式，我们不知道目前正在使用的浏览器支持哪几种。
    就好比我们有一个钥匙串，其中共有 3 把钥匙，我们想打开一扇门但是不知道该使用哪把钥匙，
    于是从第一把钥匙开始，迭代钥匙串进行尝试，直到找到了正确的钥匙为止。

    同样，我们把每种获取 upload 对象的方法都封装在各自的函数里，然后使用一个迭代器，迭代获取这些 upload 对象，直到获取到一个可用的为止：
 */

var getActiveUploadObj = function(){ 
    try{ 
        return new ActiveXObject( "TXFTNActiveX.FTNUpload" ); // IE 上传控件
    }catch(e){ 
        return false; 
    } 
}; 

var getFlashUploadObj = function(){ 
    if ( supportFlash() ){ // supportFlash 函数未提供
        var str = '<object type="application/x-shockwave-flash"></object>'; 
        return $( str ).appendTo( $('body') ); 
    } 
    return false; 
}; 

var getFormUpladObj = function(){ 
    var str = '<input name="file" type="file" class="ui-file"/>'; // 表单上传
    return $( str ).appendTo( $('body') ); 
};

/*
    在 getActiveUploadObj、getFlashUploadObj、getFormUpladObj 这 3 个函数中都有同一个约定：
    如果该函数里面的 upload 对象是可用的，则让函数返回该对象，反之返回 false，提示迭代器继续往后面进行迭代。
    所以我们的迭代器只需进行下面这几步工作。

        提供一个可以被迭代的方法，使得 getActiveUploadObj，getFlashUploadObj 以及 getFlashUploadObj依照优先级被循环迭代。

        如果正在被迭代的函数返回一个对象，则表示找到了正确的 upload 对象，反之如果该函数返回 false，则让迭代器继续工作。 
 */

// 迭代器代码如下：
var iteratorUploadObj = function(){ 
    for ( var i = 0, fn; fn = arguments[ i++ ]; ){ 
        var uploadObj = fn(); 
        if ( uploadObj !== false ){ 
            return uploadObj; 
        } 
    } 
}; 

var uploadObj = iteratorUploadObj( getActiveUploadObj, getFlashUploadObj, getFormUpladObj );

/*
    重构代码之后，我们可以看到，获取不同上传对象的方法被隔离在各自的函数里互不干扰，try、catch 和 if 分支不再纠缠在一起，
    使得我们可以很方便地的维护和扩展代码。
    比如，后来我们又给上传项目增加了 Webkit 控件上传和 HTML5 上传，我们要做的仅仅是下面一些工作。
 */

// 增加分别获取 Webkit 控件上传对象和 HTML5 上传对象的函数：
var getWebkitUploadObj = function(){ 
    // 具体代码略
}; 

var getHtml5UploadObj = function(){ 
    // 具体代码略
};

// 依照优先级把它们添加进迭代器：
var uploadObj = iteratorUploadObj( getActiveUploadObj, getWebkitUploadObj, getFlashUploadObj, getHtml5UploadObj, getFormUpladObj );
