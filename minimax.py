PLAYER = "X"
AI = "O"


def check_winner(board):

    wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ]

    for win in wins:

        a,b,c = win

        if board[a] == board[b] == board[c] and board[a] != "":
            return board[a]

    if "" not in board:
        return "Draw"

    return None


def minimax(board, is_ai):

    winner = check_winner(board)

    if winner == AI:
        return 1

    if winner == PLAYER:
        return -1

    if winner == "Draw":
        return 0

    if is_ai:

        best = -100

        for i in range(9):

            if board[i] == "":

                board[i] = AI

                score = minimax(board, False)

                board[i] = ""

                best = max(best, score)

        return best

    else:

        best = 100

        for i in range(9):

            if board[i] == "":

                board[i] = PLAYER

                score = minimax(board, True)

                board[i] = ""

                best = min(best, score)

        return best


def best_move(board):

    best_score = -100

    move = -1

    for i in range(9):

        if board[i] == "":

            board[i] = AI

            score = minimax(board, False)

            board[i] = ""

            if score > best_score:

                best_score = score

                move = i

    return move