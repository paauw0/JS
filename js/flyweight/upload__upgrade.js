/**
 * 享元模式重构文件上传
 */

/*
    上一节的代码是第一版的文件上传，在这段代码里有多少个需要上传的文件，就一共创建了多少个 upload 对象，接下来我们用享元模式重构它。

    首先，我们需要确认插件类型 uploadType 是内部状态，那为什么单单 uploadType 是内部状态呢？
    前面讲过，划分内部状态和外部状态的关键主要有以下几点。

        内部状态储存于对象内部。
        内部状态可以被一些对象共享。
        内部状态独立于具体的场景，通常不会改变。
        外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。

    在文件上传的例子里，upload 对象必须依赖 uploadType 属性才能工作，这是因为插件上传、Flash 上传、表单上传的实际工作原理有很大的区别，
    它们各自调用的接口也是完全不一样的，必须在对象创建之初就明确它是什么类型的插件，
    才可以在程序的运行过程中，让它们分别调用各自的 start、pause、cancel、del 等方法。

    实际上在微云的真实代码中，虽然插件和 Flash 上传对象最终创建自一个大的工厂类，
    但它们实际上根据 uploadType 值的不同，分别是来自于两个不同类的对象。
    （在目前的例子中，为了简化代码，我们把插件和 Flash 的构造函数合并成了一个。）

    一旦明确了 uploadType，无论我们使用什么方式上传，这个上传对象都是可以被任何文件共用的。
    而 fileName 和 fileSize 是根据场景而变化的，每个文件的 fileName 和 fileSize 都不一样，
    fileName 和 fileSize 没有办法被共享，它们只能被划分为外部状态。
 */

/*
    剥离外部状态
    明确了 uploadType 作为内部状态之后，我们再把其他的外部状态从构造函数中抽离出来，Upload 构造函数中只保留 uploadType 参数：
 */

var Upload = function( uploadType ){ 
    this.uploadType = uploadType; 
};

/*
    Upload.prototype.init 函数也不再需要，因为 upload 对象初始化的工作被放在了 upload-Manager.add 函数里面，
    接下来只需要定义 Upload.prototype.del 函数即可：
 */

Upload.prototype.delFile = function( id ){ 
    uploadManager.setExternalState( id, this ); // (1) 

    if ( this.fileSize < 3000 ){ 
        return this.dom.parentNode.removeChild( this.dom ); 
    }

    if ( window.confirm( '确定要删除该文件吗? ' + this.fileName ) ){ 
        return this.dom.parentNode.removeChild( this.dom ); 
    } 
};

/*
    在开始删除文件之前，需要读取文件的实际大小，而文件的实际大小被储存在外部管理器 uploadManager 中，
    所以在这里需要通过 uploadManager.setExternalState 方法给共享对象设置正确的 fileSize，
    上段代码中的(1)处表示把当前 id 对应的对象的外部状态都组装到共享对象中。
 */

/*
    工厂进行对象实例化
    接下来定义一个工厂来创建 upload 对象，如果某种内部状态对应的共享对象已经被创建过，那么直接返回这个对象，否则创建一个新的对象：
 */

var UploadFactory = (function(){ 
    var createdFlyWeightObjs = {}; 

    return { 
        create: function(uploadType){ 
            if ( createdFlyWeightObjs[uploadType] ){ 
                return createdFlyWeightObjs[uploadType]; 
            } 

            return createdFlyWeightObjs[uploadType] = new Upload(uploadType); 
        } 
    } 
})();

/*
    管理器封装外部状态
    现在我们来完善前面提到的 uploadManager 对象，它负责向 UploadFactory 提交创建对象的请求，
    并用一个 uploadDatabase 对象保存所有 upload 对象的外部状态，以便在程序运行过程中给 upload 共享对象设置外部状态，代码如下：
 */

var uploadManager = (function(){ 
    var uploadDatabase = {}; 

    return { 
        add: function( id, uploadType, fileName, fileSize ){ 
            var flyWeightObj = UploadFactory.create( uploadType ); 

            var dom = document.createElement( 'div' ); 
            dom.innerHTML = 
                '<span>文件名称:'+ fileName +', 文件大小: '+ fileSize +'</span>' + 
                '<button class="delFile">删除</button>'; 

            dom.querySelector( '.delFile' ).onclick = function(){ 
                flyWeightObj.delFile( id ); 
            }

            document.body.appendChild( dom ); 

            uploadDatabase[ id ] = { 
                fileName: fileName, 
                fileSize: fileSize, 
                dom: dom 
            }; 

            return flyWeightObj ; 
        }, 
        setExternalState: function( id, flyWeightObj ){ 
            var uploadData = uploadDatabase[ id ]; 
            for ( var i in uploadData ){ 
                flyWeightObj[ i ] = uploadData[ i ]; 
            } 
        } 
    } 
})();

// 然后是开始触发上传动作的 startUpload 函数：
var id = 0; 

window.startUpload = function( uploadType, files ){ 
    for ( var i = 0, file; file = files[ i++ ]; ){ 
        var uploadObj = uploadManager.add( ++id, uploadType, file.fileName, file.fileSize ); 
    } 
};

// 最后是测试时间，运行下面的代码后，可以发现运行结果跟用享元模式重构之前一致：
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

/*
    享元模式重构之前的代码里一共创建了 6个 upload 对象，而通过享元模式重构之后，对象的数量减少为 2，
    更幸运的是， 就算现在同时上传 2000个文件，需要创建的 upload 对象数量依然是 2。
 */

/*
    没有内部状态的享元
    假设我们是这个网站的开发者，不需要考虑极速上传与普通上传之间的切换，这意味着在之前的代码中作为内部状态的 uploadType 属性是可以删除掉的。

    在继续使用享元模式的前提下，构造函数 Upload 就变成了无参数的形式：

        var Upload = function(){};

    其他属性如 fileName、fileSize、dom 依然可以作为外部状态保存在共享对象外部。
    在 uploadType 作为内部状态的时候，它可能为控件，也可能为 Flash，所以当时最多可以组合出两个共享对象。
    而现在已经没有了内部状态，这意味着只需要唯一的一个共享对象。
    现在我们要改写创建享元对象的工厂，代码如下：

        var UploadFactory = (function(){ 
            var uploadObj; 
            return { 
                create: function(){ 
                    if ( uploadObj ){ 
                        return uploadObj; 
                    } 
                    return uploadObj = new Upload(); 
                } 
            } 
        })();

    管理器部分的代码不需要改动，还是负责剥离和组装外部状态。
    可以看到，当对象没有内部状态的时候，生产共享对象的工厂实际上变成了一个单例工厂。
    虽然这时候的共享对象没有内部状态的区分，但还是有剥离外部状态的过程，我们依然倾向于称之为享元模式。
 */

/*
    没有外部状态的享元
    
 */