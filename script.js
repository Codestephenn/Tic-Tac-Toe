// Gameboard Module
const Gameboard = (function() {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const updateBoard = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return {
    getBoard,
    updateBoard,
    resetBoard
  };
})();

// Player Factory
const Player = (name, marker) => {
  return { name, marker };
};

// Game Controller Module
const GameController = (function() {
  const playerX = Player("Player X", "X");
  const playerO = Player("Player O", "O");
  let currentPlayer = playerX;
  let running = false;

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Load sound files
  const clickSound = new Audio('sounds/click.mp3');
  const endSound = new Audio('sounds/end.mp3');

  const playClickSound = () => {
    clickSound.play();
  };

  const playEndSound = () => {
    endSound.play();
  };

  const startGame = () => {
    running = true;
    currentPlayer = playerX;
    DisplayController.updateMessage(`${currentPlayer.name}'s turn`);
    DisplayController.renderBoard();
  };

  const handleCellClick = (index) => {
    if (!running || !Gameboard.updateBoard(index, currentPlayer.marker)) {
      return;
    }
    playClickSound(); // Play sound on cell click
    DisplayController.renderBoard();
    if (checkWinner()) {
      DisplayController.updateMessage(`${currentPlayer.name} wins!`);
      playEndSound(); // Play sound when a player wins
      running = false;
    } else if (Gameboard.getBoard().every(cell => cell !== "")) {
      DisplayController.updateMessage(`It's a draw!`);
      playEndSound(); // Play sound on draw
      running = false;
    } else {
      currentPlayer = currentPlayer === playerX ? playerO : playerX;
      DisplayController.updateMessage(`${currentPlayer.name}'s turn`);
    }
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    return winConditions.some(condition => {
      const [a, b, c] = condition;
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });
  };

  const resetGame = () => {
    Gameboard.resetBoard();
    startGame();
  };

  return {
    startGame,
    handleCellClick,
    resetGame
  };
})();

// Display Controller Module
const DisplayController = (function() {
  const cells = document.querySelectorAll(".cell");
  const statsText = document.querySelector("#statsText");
  const restartBtn = document.querySelector("#restartBtn");

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => GameController.handleCellClick(index));
  });

  restartBtn.addEventListener("click", () => GameController.resetGame());

  const renderBoard = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];

      // Clear previous classes
      cell.classList.remove('X', 'O');

      // Add class based on the marker (X or O)
      if (board[index] === "X" || board[index] === "O") {
        cell.classList.add(board[index]);
      }
    });
  };

  const updateMessage = (message) => {
    statsText.textContent = message;
  };

  return {
    renderBoard,
    updateMessage
  };
})();

// Initialize the game
GameController.startGame();