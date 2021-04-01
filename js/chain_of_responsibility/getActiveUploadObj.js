/**
 * 用职责链模式获取文件上传对象
 */

/*
    iterator/getUploadObj.js 有一个用迭代器获取文件上传对象的例子：当时我们创建了一个迭代器来迭代获取合适的文件上传对象，
    其实用职责链模式可以更简单，我们完全不用创建这个多余的迭代器，完整代码如下：
 */

Function.prototype.after = function( fn ){ 
    var self = this; 
    return function(){ 
        var ret = self.apply( this, arguments ); 
        if ( ret === 'nextSuccessor' ){ 
            return fn.apply( this, arguments ); 
        } 

        return ret; 
    } 
}; 

var getActiveUploadObj = function(){ 
    try{ 
        return new ActiveXObject("TXFTNActiveX.FTNUpload"); // IE 上传控件
    }catch(e){ 
        return 'nextSuccessor' ; 
    } 
}; 

var getFlashUploadObj = function(){ 
    if ( supportFlash() ){ 
        var str = '<object type="application/x-shockwave-flash"></object>'; 
        return $( str ).appendTo( $('body') ); 
    } 
    return 'nextSuccessor' ; 
};

var getFormUpladObj = function(){ 
    return $( '<form><input name="file" type="file"/></form>' ).appendTo( $('body') ); 
}; 

var getUploadObj = getActiveUploadObj.after( getFlashUploadObj ).after( getFormUpladObj ); 

console.log( getUploadObj() );