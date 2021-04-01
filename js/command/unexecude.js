/**
 * 撤销命令
 */

/*
    撤销操作的实现一般是给命令对象增加一个名为 unexecude 或者 undo 的方法，在该方法里执行 execute 的反向操作。
 */

var ball = document.getElementById( 'ball' ); 
var pos = document.getElementById( 'pos' ); 
var moveBtn = document.getElementById( 'moveBtn' ); 
var cancelBtn = document.getElementById( 'cancelBtn' );

// 普通模式
// moveBtn.onclick = function(){ 
//     var animate = new Animate( ball ); 
//     animate.start( 'left', pos.value, 1000, 'strongEaseOut' ); 
// };

// 命令模式
var MoveCommand = function( receiver, pos ){ 
    this.receiver = receiver; 
    this.pos = pos;
    this.oldPos = null; 
}; 

MoveCommand.prototype.execute = function(){ 
    this.receiver.start( 'left', this.pos, 1000, 'strongEaseOut' ); 
    this.oldPos = this.receiver.dom.getBoundingClientRect()[ this.receiver.propertyName ]; // 记录小球开始移动前的位置
}; 

MoveCommand.prototype.unexecute = function(){ 
    this.receiver.start( 'left', this.oldPos, 1000, 'strongEaseOut' ); // 回到小球移动前记录的位置
};

var moveCommand;

moveBtn.onclick = function(){ 
    var animate = new Animate( ball ); 
    moveCommand = new MoveCommand( animate, pos.value ); 
    moveCommand.execute(); 
};

cancelBtn.onclick = function(){ 
    moveCommand.unexecute(); // 撤销命令
};