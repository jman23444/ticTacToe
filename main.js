

// gameBoard module (IIFE for single instance)
const gameBoard = (function () {
    //
    let board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    //
    const getBoard = () => [...board];
    //
    const setMark = (index, mark) => {
        if (board[index] === ' ') {
            board[index] = mark;
            return true;
        }
        return false;
    }
    //
    const reset = () => board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    //
    return { reset, getBoard, setMark };

})();

// player factory
function Player(name, mark) {
    return { name, mark };
}



// game controller module (IIFE for single instance)
const gameController = (function () {
    //
    let player1, player2, currentPlayer;
    let gameActive = false;
    //
    const startGame = (player1Name, player2Name) => {
        //
        player1 = Player(player1Name || 'Player 1', 'X');
        player2 = Player(player2Name || 'Player 2', 'O');
        currentPlayer = player1;
        gameActive = true;
        gameBoard.reset();
        displayController.renderBoard();
        displayController.updateResult('');
        document.getElementById('game-setup').style.display = 'none';
        document.getElementById('restart-game').style.display = 'block';
        document.getElementById('total-reset').style.display = 'block';
    };
    //
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
    //
    const checkWin = (board) => {
        //
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals 
        ];
        return winConditions.some(condition => 
            condition.every(index => board[index] === currentPlayer.mark)
        );
    };
    // 
    const checkTie = (board) => {
        return board.every(cell => cell !== ' ');
    };
    //
    const playTurn = (index) => {
        //
        if (!gameActive || gameBoard.getBoard()[index] !== ' ') return;
        //
        if (gameBoard.setMark(index, currentPlayer.mark)) {
            //
            const board = gameBoard.getBoard();
            displayController.renderBoard();

            if (checkWin(board)) {
                gameActive = false;
                displayController.updateResult(`${currentPlayer.name} wins!`);
            } else if (checkTie(board)) {
                gameActive = false;
                displayController.updateResult('It\'s a tie!');
            } else {
                switchPlayer();
            }
        }
    };
    // 
    const restartGame = () => {
            gameActive = false;
            startGame(player1.name, player2.name);
    };
    //
    const totalReset = () => {
        gameActive = false;
        player1 = null; 
        player2 = null; 
        currentPlayer = null; 
        gameBoard.reset(); 
        displayController.renderBoard();
        displayController.updateResult(''); 
        document.getElementById('game-setup').style.display = 'flex';
        document.getElementById('restart-game').style.display = 'none'; 
        document.getElementById('total-reset').style.display = 'none'; 
        document.getElementById('player1-name').value = ''; 
        document.getElementById('player2-name').value = '';
    };
    //
    return { startGame, playTurn, restartGame, totalReset };

})();



// Display controller module (IIFE for single instance)
const displayController = (function() {
    //
    const renderBoard = () => {
        //
        const board = gameBoard.getBoard();
        //
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach((item, index) => {
            item.textContent = board[index];
        });
    };
    //
    const updateResult = (message) => {
        document.getElementById('result').textContent = message;
    };
    //
    const initialize = () => {
        //
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach(item => {
            item.addEventListener('click', () => {
                gameController.playTurn(parseInt(item.dataset.index));
            });
        });
        //
        document.getElementById('start-game').addEventListener('click', () => {
            const player1Name = document.getElementById('player1-name').value;
            const player2Name = document.getElementById('player2-name').value;
            if (player2Name && player1Name) {
                gameController.startGame(player1Name, player2Name);
            } else {
                alert('Please enter names for both players!');
            }
        });
        // 
        document.getElementById('restart-game').addEventListener('click', () => {
            gameController.restartGame();
        });
        //
        document.getElementById('total-reset').addEventListener('click', () => {
            gameController.totalReset();
        })
    };
    //
    return { renderBoard, updateResult, initialize };

})();

// Initializing game on DOM load 
document.addEventListener('DOMContentLoaded', () => {
    displayController.initialize();
});