/**
 * 文件上传的例子
 * 在微云上传模块的开发中，我们曾经借助享元模式提升了程序的性能。
 */

/*
    对象爆炸
    在微云上传模块的开发中，我曾经经历过对象爆炸的问题。
    微云的文件上传功能虽然可以选择依照队列，一个一个地排队上传，但也支持同时选择 2000 个文件。
    每一个文件都对应着一个 JavaScript 上传对象的创建，在第一版开发中，的确往程序里同时 new 了 2000 个 upload 对象，
    结果可想而知，Chrome 中还勉强能够支撑，IE 下直接进入假死状态。
 */

/*
    微云支持好几种上传方式，比如浏览器插件、Flash 和表单上传等，为了简化例子，我们先假设只有插件和 Flash 这两种。
    不论是插件上传，还是 Flash 上传，原理都是一样的，当用户选择了文件之后，插件和 Flash 都会通知调用 Window 下的一个全局 JavaScript 函数，
    它的名字是 startUpload，用户选择的文件列表被组合成一个数组 files 塞进该函数的参数列表里，代码如下：
 */

var id = 0; 

window.startUpload = function( uploadType, files ){ // uploadType 区分是控件还是 flash 
    for ( var i = 0, file; file = files[ i++ ]; ){ 
        var uploadObj = new Upload( uploadType, file.fileName, file.fileSize ); 
        uploadObj.init( id++ ); // 给 upload 对象设置一个唯一的 id 
    } 
};

/*
    当用户选择完文件之后，startUpload 函数会遍历 files 数组来创建对应的 upload 对象。
    接下来定义 Upload 构造函数，它接受 3 个参数，分别是插件类型、文件名和文件大小。
    这些信息都已经被插件组装在 files 数组里返回，代码如下：
 */

var Upload = function( uploadType, fileName, fileSize ){ 
    this.uploadType = uploadType; 
    this.fileName = fileName; 
    this.fileSize = fileSize; 
    this.dom= null; 
}; 

Upload.prototype.init = function( id ){ 
    var that = this; 
    this.id = id; 
    this.dom = document.createElement( 'div' ); 
    this.dom.innerHTML = 
        '<span>文件名称:'+ this.fileName +', 文件大小: '+ this.fileSize +'</span>' + 
        '<button class="delFile">删除</button>'; 

    this.dom.querySelector( '.delFile' ).onclick = function(){ 
        that.delFile(); 
    } 

    document.body.appendChild( this.dom ); 
};

/*
    同样为了简化示例，我们暂且去掉了 upload 对象的其他功能，只保留删除文件的功能，对应的方法是 Upload.prototype.delFile。
    该方法中有一个逻辑：当被删除的文件小于 3000 KB 时，该文件将被直接删除。
    否则页面中会弹出一个提示框，提示用户是否确认要删除该文件，代码如下：
 */

Upload.prototype.delFile = function(){ 
    if ( this.fileSize < 3000 ){ 
        return this.dom.parentNode.removeChild( this.dom ); 
    } 

    if ( window.confirm( '确定要删除该文件吗? ' + this.fileName ) ){ 
        return this.dom.parentNode.removeChild( this.dom ); 
    } 
};

// 接下来分别创建 3 个插件上传对象和 3 个 Flash 上传对象：
startUpload( 'plugin', [ 
    { 
        fileName: '1.txt', 
        fileSize: 1000 
    }, 
    { 
        fileName: '2.html', 
        fileSize: 3000 
    }, 
    { 
        fileName: '3.txt', 
        fileSize: 5000 
    } 
]); 

startUpload( 'flash', [ 
    { 
        fileName: '4.txt', 
        fileSize: 1000 
    }, 
    { 
        fileName: '5.html', 
        fileSize: 3000 
    }, 
    { 
        fileName: '6.txt', 
        fileSize: 5000 
    } 
]);

// 当点击删除最后一个文件时，可以看到弹出了是否确认删除的提示