var Type = {}; 
for ( var i = 0, type; type = [ 'String', 'Number', 'Boolean', 'Array', 'Object', 'Function', 'Undefined', 'Null' ][ i++ ]; ){ 
    (function( type ){ 
        Type[ 'is' + type ] = function( obj ){ 
            return Object.prototype.toString.call( obj ) === '[object '+ type +']'; 
        } 
    })( type ) 
}; 
Type.isArray( [] ); // 输出：true 
Type.isString( "str" ); // 输出：true