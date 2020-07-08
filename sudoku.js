var input = [[], [], [], [], [], [], [], [], []]
var dummy = [[], [], [], [], [], [], [], [], []]

for (var r = 0; r < 9; r++)
    for (var c = 0; c < 9; c++)
        input[r][c] = document.getElementById(r * 9 + c);

function initDummy(dummy) {
    for (var r = 0; r < 9; r++)
        for (var c = 0; c < 9; c++)
            dummy[r][c] = false;
}

function setDummy(board,dummy) {
    for (var r=0;r<9;r++)
        for (var c=0;c<9;c++)
            if (board[r][c]!=0)
                dummy[r][c] = true;
}

function setColor(dummy) {
    for (var r=0;r<9;r++)
        for (var c=0;c<9;c++)
            if (dummy[r][c]==true)
                input[r][c].style.color = "red";
}

function resetColor() {
    for (var r=0;r<9;r++)
        for (var c=0;c<9;c++)
            input[r][c].style.color = "green";
}

var board = [[], [], [], [], [], [], [], [], []]

let puzzle = document.getElementById('generate');
let solve = document.getElementById('solve');

function changeBoard(board) {
    for (var r=0;r<9;r++)
        for (var c=0;c<9;c++){
            if (board[r][c]!=0)
                input[r][c].innerText = board[r][c]
            else
                input[r][c].innerText = ' '
        }
}

puzzle.onclick = function () {
    var xhrRequest = new XMLHttpRequest()
    xhrRequest.onload = function () {
        var response = JSON.parse(xhrRequest.response)
        initDummy(dummy)
        resetColor()
        board = response.board
        setDummy(board, dummy)
        setColor(dummy)
        changeBoard(board)
    }
    xhrRequest.open('get', 'https://sugoku.herokuapp.com/board?difficulty=easy')
    xhrRequest.send()
}

function isSafe(board,r,c,digit) {
    for (var k=0;k<9;k++)
            if (board[k][c]==digit || board[r][k]==digit)
                return false;
    var sx = r - r%3;
    var sy = c - c%3;

    for (var x=sx;x<sx+3;x++)
        for (var y=sy;y<sy+3;y++)
            if (board[x][y]==digit)
                return false;
    return true;
}

function solveSudokuUtil(board,r,c) {

    if (r==9){
        changeBoard(board);
        return true;
    }

    if (c==9)
        return solveSudokuUtil(board,r+1,0);

    if (board[r][c]!=0)
        return solveSudokuUtil(board,r,c+1);

    for (var d=1;d<=9;d++){
        if (isSafe(board,r,c,d)){
            board[r][c] = d;
            var isSolvable = solveSudokuUtil(board,r,c+1)
            if (isSolvable==true)
                return true;
            board[r][c] = 0;
        }
    }

    return false;

}

function solveSudoku(board){
    solveSudokuUtil(board,0,0);
}

solve.onclick = function () {
    solveSudoku(board)
}




