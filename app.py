from flask import Flask, render_template, request, jsonify
from minimax import best_move

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ai_move", methods=["POST"])
def ai_move():

    board = request.json["board"]

    move = best_move(board)

    return jsonify({"move": move})

if __name__ == "__main__":
    app.run(debug=True)