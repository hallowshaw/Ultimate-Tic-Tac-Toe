import React from "react";
import Square from "./Square";
import generateGridNxN from "../util/GameUtil";

const Board = (props) => {
  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        value={props.squares[i]}
        winner={props.winner}
        clickable={props.clickable}
        onClick={() => props.onClick(i)}
      />
    );
  };

  return generateGridNxN("board", props.size, renderSquare);
};

export default Board;
