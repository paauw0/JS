/**
 * 中介者模式
 */

/*
    现实中的中介者
    1. 机场指挥塔
        中介者也被称为调停者，我们想象一下机场的指挥塔，
        如果没有指挥塔的存在，每一架飞机要和方圆 100 公里内的所有飞机通信，才能确定航线以及飞行状况，后果是不可想象的。
        现实中的情况是，每架飞机都只需要和指挥塔通信。
        指挥塔作为调停者，知道每一架飞机的飞行状况，所以它可以安排所有飞机的起降时间，及时做出航线调整。
    2. 博彩公司
        打麻将的人经常遇到这样的问题，打了几局之后开始计算钱，A 自摸了两把，B 杠了三次，
        C 点炮一次给 D，谁应该给谁多少钱已经很难计算清楚，而这还是在只有 4 个人参与的情况下。
        
        在世界杯期间购买足球彩票，如果没有博彩公司作为中介，上千万的人一起计算赔率和输赢绝对是不可能实现的事情。
        有了博彩公司作为中介，每个人只需和博彩公司发生关联，博彩公司会根据所有人的投注情况计算好赔率，
        彩民们赢了钱就从博彩公司拿，输了钱就交给博彩公司。
 */

/*
    中介者模式的例子——泡泡堂游戏
    大家可能都还记得泡泡堂游戏，我曾经写过一个 JS 版的泡泡堂，现在我们来一起回顾这个游戏，在游戏之初只支持两个玩家同时进行对战。

    先定义一个玩家构造函数，它有 3 个简单的原型方法：Play.prototype.win、Play.prototype.lose以及表示玩家死亡的 Play.prototype.die。

    因为玩家的数目是 2，所以当其中一个玩家死亡的时候游戏便结束, 同时通知它的对手胜利。
 */

// 这段代码看起来很简单：
function Player( name ){ 
    this.name = name 
    this.enemy = null; // 敌人
}; 

Player.prototype.win = function(){ 
    console.log( this.name + ' won ' ); 
}; 

Player.prototype.lose = function(){ 
    console.log( this.name +' lost' ); 
}; 

Player.prototype.die = function(){ 
    this.lose(); 
    this.enemy.win(); 
};

// 接下来创建 2 个玩家对象：
var player1 = new Player( '皮蛋' ); 
var player2 = new Player( '小乖' );

// 给玩家相互设置敌人：
player1.enemy = player2; 
player2.enemy = player1;

// 当玩家 player1 被泡泡炸死的时候，只需要调用这一句代码便完成了一局游戏：
player1.die();// 输出：皮蛋 lost、小乖 won

// 我曾用这个游戏自娱自乐了一阵子，但不久过后就觉得只有 2 个玩家其实没什么意思，真正的泡泡堂游戏至多可以有 8 个玩家，并分成红蓝两队进行游戏。

/*
    为游戏增加队伍
 */

// 现在我们改进一下游戏。因为玩家数量变多，用下面的方式来设置队友和敌人无疑很低效：
player1.partners= [player1,player2,player3,player4]; 
player1.enemies = [player5,player6,player7,player8]; 

Player5.partners= [player5,player6,player7,player8]; 
Player5.enemies = [player1,player2,player3,player4];

// 所以我们定义一个数组 players 来保存所有的玩家，在创建玩家之后，循环 players 来给每个玩家设置队友和敌人:
var players = [];

// 再改写构造函数 Player，使每个玩家对象都增加一些属性，分别是队友列表、敌人列表 、玩家当前状态、角色名字以及玩家所在的队伍颜色：
function Player( name, teamColor ){ 
    this.partners = []; // 队友列表
    this.enemies = []; // 敌人列表
    this.state = 'live'; // 玩家状态
    this.name = name; // 角色名字
    this.teamColor = teamColor; // 队伍颜色
};

// 玩家胜利和失败之后的展现依然很简单，只是在每个玩家的屏幕上简单地弹出提示：
Player.prototype.win = function(){ // 玩家团队胜利
    console.log( 'winner: ' + this.name ); 
}; 

Player.prototype.lose = function(){ // 玩家团队失败
    console.log( 'loser: ' + this.name ); 
};

// 玩家死亡的方法要变得稍微复杂一点，我们需要在每个玩家死亡的时候，都遍历其他队友的生存状况，
// 如果队友全部死亡，则这局游戏失败，同时敌人队伍的所有玩家都取得胜利，代码如下：
Player.prototype.die = function(){ // 玩家死亡
    var all_dead = true;
    this.state = 'dead'; // 设置玩家状态为死亡
    for ( var i = 0, partner; partner = this.partners[ i++ ]; ){ // 遍历队友列表
        if ( partner.state !== 'dead' ){ // 如果还有一个队友没有死亡，则游戏还未失败
            all_dead = false; 
            break; 
        } 
    } 
    if ( all_dead === true ){ // 如果队友全部死亡
        this.lose(); // 通知自己游戏失败
        for ( var i = 0, partner; partner = this.partners[ i++ ]; ){ // 通知所有队友玩家游戏失败
            partner.lose(); 
        } 
        for ( var i = 0, enemy; enemy = this.enemies[ i++ ]; ){ // 通知所有敌人游戏胜利
            enemy.win(); 
        } 
    } 
};

// 最后定义一个工厂来创建玩家：
var playerFactory = function( name, teamColor ){ 
    var newPlayer = new Player( name, teamColor ); // 创建新玩家
    for ( var i = 0, player; player = players[ i++ ]; ){ // 通知所有的玩家，有新角色加入
        if ( player.teamColor === newPlayer.teamColor ){ // 如果是同一队的玩家
            player.partners.push( newPlayer ); // 相互添加到队友列表
            newPlayer.partners.push( player ); 
        }else{ 
            player.enemies.push( newPlayer ); // 相互添加到敌人列表
            newPlayer.enemies.push( player ); 
        } 
    } 
    players.push( newPlayer ); 
    return newPlayer; 
};

// 现在来感受一下, 用这段代码创建 8 个玩家：
//红队：
var player1 = playerFactory( '皮蛋', 'red' ), 
    player2 = playerFactory( '小乖', 'red' ), 
    player3 = playerFactory( '宝宝', 'red' ), 
    player4 = playerFactory( '小强', 'red' ); 

//蓝队：
var player5 = playerFactory( '黑妞', 'blue' ), 
    player6 = playerFactory( '葱头', 'blue' ), 
    player7 = playerFactory( '胖墩', 'blue' ), 
    player8 = playerFactory( '海盗', 'blue' );

// 让红队玩家全部死亡：
player1.die(); 
player2.die(); 
player4.die(); 
player3.die();

/*
    玩家增多带来的困扰
    现在我们已经可以随意地为游戏增加玩家或者队伍，但问题是，每个玩家和其他玩家都是紧紧耦合在一起的。
    在此段代码中，每个玩家对象都有两个属性，this.partners 和 this.enemies，用来保存其他玩家对象的引用。
    当每个对象的状态发生改变，比如角色移动、吃到道具或者死亡时，都必须要显式地遍历通知其他对象。

    在这个例子中只创建了 8 个玩家，或许还没有对你产生足够多的困扰，而如果在一个大型网络游戏中，画面里有成百上千个玩家，几十支队伍在互相厮杀。
    如果有一个玩家掉线，必须从所有其他玩家的队友列表和敌人列表中都移除这个玩家。
    游戏也许还有解除队伍和添加到别的队伍的功能，红色玩家可以突然变成蓝色玩家，这就不再仅仅是循环能够解决的问题了。
    面对这样的需求，我们上面的代码可以迅速进入投降模式。
 */

/*
    用中介者模式改造泡泡堂游戏
    现在我们开始用中介者模式来改造上面的泡泡堂游戏
 */

// 首先仍然是定义 Player 构造函数和 player 对象的原型方法，在 player 对象的这些原型方法中，不再负责具体的执行逻辑，
// 而是把操作转交给中介者对象，我们把中介者对象命名为 playerDirector：
function Player( name, teamColor ){ 
    this.name = name; // 角色名字
    this.teamColor = teamColor; // 队伍颜色 
    this.state = 'alive'; // 玩家生存状态
}; 

Player.prototype.win = function(){ 
    console.log( this.name + ' won ' ); 
}; 

Player.prototype.lose = function(){ 
    console.log( this.name +' lost' ); 
};

/*******************玩家死亡*****************/ 
Player.prototype.die = function(){ 
    this.state = 'dead'; 
    playerDirector.reciveMessage( 'playerDead', this ); // 给中介者发送消息，玩家死亡
};

/*******************移除玩家*****************/ 
Player.prototype.remove = function(){ 
    playerDirector.reciveMessage( 'removePlayer', this ); // 给中介者发送消息，移除一个玩家
};

/*******************玩家换队*****************/ 
Player.prototype.changeTeam = function( color ){ 
    playerDirector.reciveMessage( 'changeTeam', this, color ); // 给中介者发送消息，玩家换队
};

// 再继续改写之前创建玩家对象的工厂函数，可以看到，因为工厂函数里不再需要给创建的玩家对象设置队友和敌人，这个工厂函数几乎失去了工厂的意义：
var playerFactory = function( name, teamColor ){ 
    var newPlayer = new Player( name, teamColor ); // 创造一个新的玩家对象
    playerDirector.reciveMessage( 'addPlayer', newPlayer ); // 给中介者发送消息，新增玩家
    return newPlayer; 
};

/*
    最后，我们需要实现这个中介者 playerDirector 对象，一般有以下两种方式。
        利用发布—订阅模式。
        将 playerDirector 实现为订阅者，各 player 作为发布者，
        一旦 player的状态发生改变，便推送消息给 playerDirector，playerDirector 处理消息后将反馈发送给其他 player。

        在 playerDirector 中开放一些接收消息的接口，各 player 可以直接调用该接口来给playerDirector 发送消息，
        player 只需传递一个参数给 playerDirector，这个参数的目的是使 playerDirector 可以识别发送者。
        同样，playerDirector 接收到消息之后会将处理结果反馈给其他 player。

    这两种方式的实现没什么本质上的区别。在这里我们使用第二种方式，playerDirector 开放一个对外暴露的接口 reciveMessage，
    负责接收 player 对象发送的消息，而 player 对象发送消息的时候，总是把自身 this 作为参数发送给 playerDirector，
    以便 playerDirector 识别消息来自于哪个玩家对象。
 */

// 代码如下：
var playerDirector= ( function(){ 
    var players = {}, // 保存所有玩家
    operations = {}; // 中介者可以执行的操作

    /****************新增一个玩家***************************/ 
    operations.addPlayer = function( player ){ 
        var teamColor = player.teamColor; // 玩家的队伍颜色
        players[ teamColor ] = players[ teamColor ] || []; // 如果该颜色的玩家还没有成立队伍，则新成立一个队伍
        players[ teamColor ].push( player ); // 添加玩家进队伍
    }; 

    /****************移除一个玩家***************************/ 
    operations.removePlayer = function( player ){ 
        var teamColor = player.teamColor, // 玩家的队伍颜色
        teamPlayers = players[ teamColor ] || []; // 该队伍所有成员
        for ( var i = teamPlayers.length - 1; i >= 0; i-- ){ // 遍历删除
            if ( teamPlayers[ i ] === player ){ 
                teamPlayers.splice( i, 1 ); 
            } 
        } 
    };

    /****************玩家换队***************************/ 
    operations.changeTeam = function( player, newTeamColor ){ // 玩家换队
        operations.removePlayer( player ); // 从原队伍中删除
        player.teamColor = newTeamColor; // 改变队伍颜色
        operations.addPlayer( player ); // 增加到新队伍中
    };

    operations.playerDead = function( player ){ // 玩家死亡
        var teamColor = player.teamColor, 
            teamPlayers = players[ teamColor ]; // 玩家所在队伍

        var all_dead = true; 

        for ( var i = 0, player; player = teamPlayers[ i++ ]; ){ 
            if ( player.state !== 'dead' ){ 
                all_dead = false; 
                break; 
            } 
        } 

        if ( all_dead === true ){ // 全部死亡

            for ( var i = 0, player; player = teamPlayers[ i++ ]; ){ 
                player.lose(); // 本队所有玩家 lose 
            } 

            for ( var color in players ){ 
                if ( color !== teamColor ){ 
                    var teamPlayers = players[ color ]; // 其他队伍的玩家
                    for ( var i = 0, player; player = teamPlayers[ i++ ]; ){ 
                        player.win(); // 其他队伍所有玩家 win 
                    } 
                } 
            } 
        } 
    }; 

    var reciveMessage = function(){ 
        var message = Array.prototype.shift.call( arguments ); // arguments 的第一个参数为消息名称
        operations[ message ].apply( this, arguments ); 
    }; 

    return { 
        reciveMessage: reciveMessage 
    } 

})();

/*
    可以看到，除了中介者本身，没有一个玩家知道其他任何玩家的存在，玩家与玩家之间的耦合关系已经完全解除，
    某个玩家的任何操作都不需要通知其他玩家，而只需要给中介者发送一个消息，中介者处理完消息之后会把处理结果反馈给其他的玩家对象。
    我们还可以继续给中介者扩展更多功能，以适应游戏需求的不断变化。
 */

// 我们来看下测试结果：
// 红队：
var player1 = playerFactory( '皮蛋', 'red' ), 
    player2 = playerFactory( '小乖', 'red' ), 
    player3 = playerFactory( '宝宝', 'red' ), 
    player4 = playerFactory( '小强', 'red' ); 

// 蓝队：
var player5 = playerFactory( '黑妞', 'blue' ), 
    player6 = playerFactory( '葱头', 'blue' ), 
    player7 = playerFactory( '胖墩', 'blue' ), 
    player8 = playerFactory( '海盗', 'blue' ); 

player1.die(); 
player2.die(); 
player3.die(); 
player4.die();

// 假设皮蛋和小乖掉线
player1.remove(); 
player2.remove(); 
player3.die(); 
player4.die();

// 假设皮蛋从红队叛变到蓝队
player1.changeTeam( 'blue' ); 
player2.die(); 
player3.die(); 
player4.die();

/*
    中介者模式是迎合迪米特法则的一种实现。
    迪米特法则也叫最少知识原则，是指一个对象应该尽可能少地了解另外的对象（类似不和陌生人说话）。
    如果对象之间的耦合性太高，一个对象发生改变之后，难免会影响到其他的对象，跟“城门失火，殃及池鱼”的道理是一样的。
    而在中介者模式里，对象之间几乎不知道彼此的存在，它们只能通过中介者对象来互相影响对方。

    因此，中介者模式使各个对象之间得以解耦，以中介者和对象之间的一对多关系取代了对象之间的网状多对多关系。
    各个对象只需关注自身功能的实现，对象之间的交互关系交给了中介者对象来实现和维护。

    不过，中介者模式也存在一些缺点。
    其中，最大的缺点是系统中会新增一个中介者对象，因为对象之间交互的复杂性，转移成了中介者对象的复杂性，使得中介者对象经常是巨大的。
    中介者对象自身往往就是一个难以维护的对象。

    我们都知道，毒贩子虽然使吸毒者和制毒者之间的耦合度降低，但毒贩子也要抽走一部分利润。
    同样，在程序中，中介者对象要占去一部分内存。
    而且毒贩本身还要防止被警察抓住，因为它了解整个犯罪链条中的所有关系，这表明中介者对象自身往往是一个难以维护的对象。

    中介者模式可以非常方便地对模块或者对象进行解耦，但对象之间并非一定需要解耦。
    在实际项目中，模块或对象之间有一些依赖关系是很正常的。
    毕竟我们写程序是为了快速完成项目交付生产，而不是堆砌模式和过度设计。
    关键就在于如何去衡量对象之间的耦合程度。
    一般来说，如果对象之间的复杂耦合确实导致调用和维护出现了困难，而且这些耦合度随项目的变化呈指数增长曲线，
    那我们就可以考虑用中介者模式来重构代码。
 */