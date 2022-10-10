
//落子数组
var chessBoard = [];
//默认玩家黑棋先手，电脑白棋后手
var me = true;
//游戏是否结束
var over = false;
//全部赢法数组
var wins = [];

//统计记法数组  
var myWin = [];
var computerWin = [];

//初始化落子数组
for (var i = 0; i < 15; i++) {
    chessBoard[i] = [];
    for (var j = 0; j < 15; j++) {
        chessBoard[i][j] = 0;
    }
}

//初始化全部赢法的三维数组
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}
//赢法统计
var count = 0;
//横线
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;
        }
        count++;
    }
}
//纵线
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;
        }
        count++;
    }
}
//正斜线
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;
        }
        count++;
    }
}
//反斜线
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;
        }
        count++;
    }
}

console.log(count);

//统计数组的实例化
for (var i = 0; i < count; i++) {
    myWin[i] = 0;
    computerWin[i] = 0;
}


var cnv = document.getElementById('canvas');
var cnt = cnv.getContext('2d');
cnt.strokeStyle = '#000';

//导入棋盘背景
var img = new Image();
img.src = 'images/board.jpg';
img.onload = function () {
    cnt.drawImage(img, 0, 0, 450, 450);
    //绘制棋盘网格
    drawLine();
}

//绘制棋盘
function drawLine() {
    for (var i = 0; i < 15; i++) {
        cnt.moveTo(15 + i * 30, 15);
        cnt.lineTo(15 + i * 30, 435);
        cnt.stroke();
        cnt.moveTo(15, 15 + i * 30);
        cnt.lineTo(435, 15 + i * 30);
        cnt.stroke();
    }
}


//绘制棋子
function oneStep(i, j, me) { //i,j分别是在棋盘中的定位，me代表黑棋还是白棋
    cnt.beginPath();
    cnt.arc(15 + i * 30, 15 + j * 30, 13, 0, Math.PI / 180 * 360, false); //半径为13
    cnt.closePath();
    var gradient = cnt.createRadialGradient(15 + i * 30, 15 + j * 30, 0, 15 + i * 30 + 2, 15 + j * 30 - 2, 15);
    if (me) {
        gradient.addColorStop(0, '#636766');
        gradient.addColorStop(1, '#0a0a0a');
    } else {
        gradient.addColorStop(0, '#f9f9f9');
        gradient.addColorStop(1, '#d1d1d1');
    }
    cnt.fillStyle = gradient;
    cnt.fill();
}

//为棋盘添加点击事件
cnv.onclick = function (e) {
    if (over) {
        return;
    }
    if (!me) {
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    //判断当前位置是否有棋子
    if (chessBoard[i][j] == 0) {
        oneStep(i, j, me);
        chessBoard[i][j] = 1; //黑棋为 1 

        //落下子后需要进行统计
        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) { //某种赢法的某子为true，可以落子。
                myWin[k]++; //离胜利又进一步
                computerWin[k] = 6; //该种赢法计算机没有机会了
                if (myWin[k] == 5) { //如果达到5就赢了
                    alert("厉害，你赢了！！");
                    over = true;
                }
            }
        }
        if (!over) {
            me = !me; //如果有幸没有结束，下棋权利交给计算机
            computerAI(); //计算机AI
        }
    }
}

//计算机落子
function computerAI() {
    var myScore = []; //定义两个二维数组，用于存放每个点的分值
    var computerScore = [];
    var max = 0; //落子的价值
    var u = 0; //落子的坐标
    var v = 0;

    //初始化分值统计数组
    for (var i = 0; i < 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    //为所有赢法打分
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (chessBoard[i][j] == 0) { //该点可下棋
                for (var k = 0; k < count; k++) { //遍历所有赢法
                    if (wins[i][j][k]) { //这种赢法已经有子
                        if (myWin[k] == 1) { //黑方，有1个子
                            myScore[i][j] += 200;
                            // console.log('(' + i + ',' + j + ')');
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400;
                            // console.log('(' + i + ',' + j + ')');
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000;
                            // console.log('(' + i + ',' + j + ')');
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 10000;
                            // console.log('(' + i + ',' + j + ')');
                        }

                        if (computerWin[k] == 1) { //白方，有1个子
                            computerScore[i][j] += 220;
                        } else if (computerWin[k] == 2) {
                            computerScore[i][j] += 420;
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 2100;
                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += 20000;
                        }
                    }
                }

                //下面判断计算机落子的最佳处
                if (myScore[i][j] > max) { //人在某步的权值更高的时候
                    max = myScore[i][j];
                    u = i;
                    v = j;
                } else if (myScore[i][j] == max) { //如果权值是最大了
                    if (computerScore[i][j] > computerScore[u][v]) { //而i,j点的权值比在u,v点的更大时
                        u = i;
                        v = j;
                    }
                }
                if (computerScore[i][j] > max) { //计算机在某步的权值更高的时候
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                } else if (computerScore[i][j] == max) { //如果权值是最大了
                    if (myScore[i][j] > myScore[u][v]) { //而计算机在此处落子更有用
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }

    oneStep(u, v, false); //上面得到最佳落子点，现在为其落白子
    chessBoard[u][v] = 2;
    //计算机落子之后需要进行统计
    for (var k = 0; k < count; k++) {
        if (wins[u][v][k]) { //第k种解法的某处为true，可以落子。
            computerWin[k]++; //计算机离胜利又近一步
            myWin[k] = 6; //玩家在第k中解法中没有机会
            if (computerWin[k] == 5) { //如果第k种解法集齐五子，则获胜
                alert('计算机赢了！');
                over = true;
            }
        }
    }
    if (!over) {
        me = !me; //如果游戏没有结束，则轮到玩家落子。
    }
}
