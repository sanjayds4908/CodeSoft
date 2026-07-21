const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

// Winning combinations
const winningConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// Add click events
cells.forEach(cell => {
    cell.addEventListener("click", playerMove);
});

// Restart
restartBtn.addEventListener("click", restartGame);

// Human Move
async function playerMove() {

    const index = this.getAttribute("data-index");

    if (board[index] !== "" || !gameActive)
        return;

    board[index] = "X";
    this.textContent = "X";

    if (checkWinner("X"))
        return;

    if (checkDraw())
        return;

    statusText.innerHTML = "🤖 AI is thinking...";

    // Send board to Flask
    const response = await fetch("/ai_move", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            board: board
        })
    });

    const data = await response.json();

    if (data.move !== -1) {

        board[data.move] = "O";

        cells[data.move].textContent = "O";

    }

    if (checkWinner("O"))
        return;

    checkDraw();

}

// Check Winner
function checkWinner(player) {

    for (let win of winningConditions) {

        let a = win[0];
        let b = win[1];
        let c = win[2];

        if (
            board[a] === player &&
            board[b] === player &&
            board[c] === player
        ) {

            statusText.innerHTML =
                player === "X"
                ? "🎉 You Win!"
                : "🤖 AI Wins!";

            gameActive = false;

            return true;
        }

    }

    statusText.innerHTML = "Your Turn (X)";

    return false;

}

// Check Draw
function checkDraw() {

    if (!board.includes("")) {

        statusText.innerHTML = "🤝 Match Draw!";

        gameActive = false;

        return true;

    }

    return false;

}

// Restart Game
function restartGame() {

    board = ["","","","","","","","",""];

    gameActive = true;

    statusText.innerHTML = "Your Turn (X)";

    cells.forEach(cell => {
        cell.textContent = "";
    });

}