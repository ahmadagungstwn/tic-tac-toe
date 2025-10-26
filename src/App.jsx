import { useState } from "react";

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${isWinning ? "winning" : ""} ${
        value ? "filled" : ""
      }`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : [];

  let status;
  if (winner) {
    status = (
      <span className="status-winner">
        🎉 Pemenang: <span className={`player-${winner}`}>{winner}</span> 🎉
      </span>
    );
  } else if (squares.every((square) => square !== null)) {
    status = <span className="status-draw">🤝 Seri! 🤝</span>;
  } else {
    status = (
      <span className="status-next">
        Pemain berikutnya:{" "}
        <span className={`player-${xIsNext ? "X" : "O"}`}>
          {xIsNext ? "X" : "O"}
        </span>
      </span>
    );
  }

  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onSquareClick={() => handleClick(i)}
      isWinning={winningLine.includes(i)}
    />
  );

  return (
    <div className="board-container">
      <div className="status">{status}</div>
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div key={row} className="board-row">
            {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  let moves = history.map((squares, move) => {
    const isCurrent = move === currentMove;
    let description;

    if (move === 0) {
      description = "Mulai permainan";
    } else {
      const prevSquares = history[move - 1];
      const moveIndex = squares.findIndex(
        (square, index) => square !== prevSquares[index]
      );
      const row = Math.floor(moveIndex / 3) + 1;
      const col = (moveIndex % 3) + 1;
      description = `Langkah #${move} (${row},${col})`;
    }

    return (
      <li key={move} className={isCurrent ? "current-move" : ""}>
        <button
          onClick={() => jumpTo(move)}
          className={isCurrent ? "move-button current" : "move-button"}
        >
          {isCurrent ? <strong>→ {description}</strong> : description}
        </button>
      </li>
    );
  });

  if (!sortAscending) {
    moves = moves.slice().reverse();
  }

  return (
    <div className="game">
      <div className="game-header">
        <h1>🎮 Tic Tac Toe 🎮</h1>
      </div>
      <div className="game-content">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <div className="game-controls">
            <button onClick={resetGame} className="reset-button">
              🔄 Reset Permainan
            </button>
            <button
              onClick={() => setSortAscending(!sortAscending)}
              className="sort-button"
            >
              {sortAscending ? "⬇️ Urut Turun" : "⬆️ Urut Naik"}
            </button>
          </div>
          <div className="moves-section">
            <h3>Riwayat Langkah:</h3>
            <ol className="moves-list">{moves}</ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c],
      };
    }
  }
  return null;
}
