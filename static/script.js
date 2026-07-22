const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const boardElement = document.getElementById("board");

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let aiThinking = false;

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

// =======================
// Human Move
// =======================
async function playerMove() {

    const index = this.getAttribute("data-index");

    // Prevent extra clicks
    if (
        board[index] !== "" ||
        !gameActive ||
        aiThinking
    ) {
        return;
    }

    // Human move
    board[index] = "X";
    this.textContent = "X";

    // Check win
    if (checkWinner("X")) return;

    // Check draw
    if (checkDraw()) return;

    // Lock board
    aiThinking = true;
    boardElement.style.pointerEvents = "none";
    statusText.innerHTML = "🤖 AI is thinking...";

    try {

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

        if (checkWinner("O")) return;

        checkDraw();

    }
    catch(error){

        console.error(error);
        alert("Error connecting to AI!");

    }
    finally{

        aiThinking = false;
        boardElement.style.pointerEvents = "auto";

        if(gameActive){
            statusText.innerHTML = "Your Turn (X)";
        }

    }

}

// =======================
// Winner
// =======================
function checkWinner(player) {

    for (let win of winningConditions) {

        const [a,b,c] = win;

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
            boardElement.style.pointerEvents = "none";

            return true;
        }

    }

    return false;

}

// =======================
// Draw
// =======================
function checkDraw() {

    if (!board.includes("")) {

        statusText.innerHTML = "🤝 Match Draw!";

        gameActive = false;
        boardElement.style.pointerEvents = "none";

        return true;

    }

    return false;

}

// =======================
// Restart
// =======================
function restartGame() {

    board = ["","","","","","","","",""];

    gameActive = true;
    aiThinking = false;

    boardElement.style.pointerEvents = "auto";

    statusText.innerHTML = "Your Turn (X)";

    cells.forEach(cell => {
        cell.textContent = "";
    });

}