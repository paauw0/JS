/**
 * 宏命令
 * 宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令。
 */

// 宏命令是命令模式与组合模式的联用产物

 var closeDoorCommand = { 
    execute: function(){ 
        console.log( '关门' ); 
    } 
}; 

var openPcCommand = { 
    execute: function(){ 
        console.log( '开电脑' ); 
    } 
};

var openQQCommand = { 
    execute: function(){ 
        console.log( '登录 QQ' ); 
    } 
};

// macroCommand.add 方法表示把子命令添加进宏命令对象，当调用宏命令对象的 execute 方法时，会迭代这一组子命令对象，并且依次执行它们的 execute 方法：
var MacroCommand = function(){ 
    return { 
        commandsList: [], 
        add: function( command ){ 
            this.commandsList.push( command ); 
        }, 
        execute: function(){ 
            for ( var i = 0, command; command = this.commandsList[ i++ ]; ){ 
                command.execute(); 
            } 
        } 
    } 
}; 

var macroCommand = MacroCommand(); 

macroCommand.add( closeDoorCommand ); 
macroCommand.add( openPcCommand ); 
macroCommand.add( openQQCommand ); 

macroCommand.execute();