import React, { useState } from "react";
import Board from "./Board";
import CountDown from "./CountDown";
import generateGridNxN from "../util/GameUtil";

const Game = (props) => {
  const rules = () => {
    window.location.href =
      "https://www.thegamegal.com/2018/09/01/ultimate-tic-tac-toe/";
  };
  const [state, setState] = useState({
    history: [
      {
        squares: Array(props.size * props.size).fill(
          Array(props.size * props.size).fill(null)
        ),
        localWinners: Array(props.size * props.size).fill(null),
        lastMoveLocation: {
          row: null,
          col: null,
          outerRow: null,
          outerCol: null,
        },
        xIsNext: true,
        winner: null,
      },
    ],
    stepNumber: 0,
  });

  const timeOver = (player) => {
    if (player === "X") {
      setState({ ...state, winner: "O" });
    } else {
      setState({ ...state, winner: "X" });
    }
  };

  const isCurrentBoard = (idx) => {
    const current = state.history[state.stepNumber];
    if (current.winner) return false;
    const lastRow = current.lastMoveLocation.row;
    const lastCol = current.lastMoveLocation.col;
    if (lastRow === null || lastCol === null) {
      return true;
    } else {
      const currentBoard = lastRow * props.size + lastCol;
      if (current.localWinners[currentBoard]) {
        return current.localWinners[idx] === null;
      } else {
        return idx === currentBoard;
      }
    }
  };

  const handleClick = (inner_idx, outer_idx) => {
    const size = props.size;
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.map((row) => row.slice());
    const localWinners = current.localWinners.slice();
    if (
      current.winner ||
      !isCurrentBoard(outer_idx) ||
      squares[outer_idx][inner_idx]
    ) {
      return;
    }
    squares[outer_idx][inner_idx] = current.xIsNext ? "X" : "O";
    const lastMoveLocation = {
      row: Math.floor(inner_idx / size),
      col: inner_idx % size,
      outerRow: Math.floor(outer_idx / size),
      outerCol: outer_idx % size,
    };
    const newWinnerLine = calculateWinner(squares[outer_idx], lastMoveLocation);
    localWinners[outer_idx] =
      newWinnerLine && squares[outer_idx][newWinnerLine[0]];
    const globalWinnerLine = calculateWinner(localWinners, {
      row: lastMoveLocation.outerRow,
      col: lastMoveLocation.outerCol,
    });
    const winner = globalWinnerLine ? localWinners[globalWinnerLine[0]] : null;
    setState({
      history: history.concat([
        {
          squares: squares,
          localWinners: localWinners,
          lastMoveLocation: lastMoveLocation,
          xIsNext: !current.xIsNext,
          winner: winner,
        },
      ]),
      stepNumber: history.length,
    });
  };

  const calculateWinner = (squares, lastMoveLocation) => {
    if (
      !lastMoveLocation ||
      lastMoveLocation.row === null ||
      lastMoveLocation.col === null
    )
      return null;

    const size = Math.sqrt(squares.length);
    const x = lastMoveLocation.row;
    const y = lastMoveLocation.col;
    const lastPlayer = squares[x * size + y];
    if (lastPlayer === null) return null;

    var lines = { row: [], col: [], diag: [], antidiag: [] };
    for (let i = 0; i < size; i++) {
      lines.row.push(x * size + i);
      lines.col.push(i * size + y);
    }
    if (x === y) {
      for (let i = 0; i < size; i++) lines.diag.push(i * size + i);
    }
    if (x + y === size - 1) {
      for (let i = 0; i < size; i++)
        lines.antidiag.push(i * size + size - 1 - i);
    }

    for (let prop in lines) {
      const line = lines[prop];
      if (line.length !== size) continue;
      const result = line.reduce(
        (acc, index) => acc && squares[index] === lastPlayer,
        true
      );
      if (result) return line;
    }
    return null;
  };

  const renderBoard = (i) => {
    return (
      <Board
        key={i}
        size={props.size}
        squares={state.history[state.stepNumber].squares[i]}
        winner={state.history[state.stepNumber].localWinners[i]}
        clickable={isCurrentBoard(i)}
        onClick={(p) => handleClick(p, i)}
      />
    );
  };

  const undo = () => {
    if (state.stepNumber === 0) return;
    setState({ ...state, stepNumber: state.stepNumber - 1 });
  };

  let status;
  if (state.history[state.stepNumber].winner) {
    status = state.history[state.stepNumber].winner + " wins!";
    const lastOuterMove = {
      row: state.history[state.stepNumber].lastMoveLocation.outerRow,
      col: state.history[state.stepNumber].lastMoveLocation.outerCol,
    };
    if (
      calculateWinner(
        state.history[state.stepNumber].localWinners,
        lastOuterMove
      ) === null
    ) {
      status = "Time over! " + status;
    }
  } else {
    if (state.history[state.stepNumber].localWinners.indexOf(null) === -1) {
      status = "Draw! Everybody wins!! :D";
    } else {
      status =
        "Next player: " +
        (state.history[state.stepNumber].xIsNext
          ? props.playerXName + " (X)"
          : props.playerOName + " (O)");
    }
  }

  const timerXPaused =
    !state.history[state.stepNumber].xIsNext ||
    Boolean(state.history[state.stepNumber].winner);
  const timerOPaused =
    state.history[state.stepNumber].xIsNext ||
    Boolean(state.history[state.stepNumber].winner);
  const grid = generateGridNxN("game", props.size, renderBoard);

  return (
    <div className="game-container">
      {grid}
      {props.renderInfo && (
        <div className="game-info">
          <div style={{ marginTop: "20px", fontSize: "20px" }}>{status}</div>
          {props.clock && (
            <div>
              [TIME] {props.playerXName}:{" "}
              <CountDown
                key={1}
                player="X"
                seconds={props.time * 60}
                isPaused={timerXPaused}
                timeOverCallback={timeOver}
              />
              , {props.playerOName}:{" "}
              <CountDown
                key={2}
                player="O"
                seconds={props.time * 60}
                isPaused={timerOPaused}
                timeOverCallback={timeOver}
              />
            </div>
          )}
        </div>
      )}
      <div id="imp">
        <button className="UndoBtn" onClick={undo}>
          Undo
        </button>
        <button className="UndoBtn" onClick={rules}>
          Rules
        </button>
      </div>
    </div>
  );
};

export default Game;
