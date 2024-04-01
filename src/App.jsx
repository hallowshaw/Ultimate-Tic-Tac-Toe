import React, { useState } from "react";
import SettingsForm from "./components/SettingsForm";
import Game from "./components/Game";
import "./index.css";

const App = () => {
  const [state, setState] = useState({
    boardSize: 3,
    clock: false,
    time: 10,
    matchID: 0,
  });

  const [playerXName, setPlayerXName] = useState("Player X");
  const [playerOName, setPlayerOName] = useState("Player O");

  const newGame = (size, clock, time) => {
    const playerNameX = prompt("Enter name for Player X:", "Player X");
    const playerNameO = prompt("Enter name for Player O:", "Player O");
    setPlayerXName(playerNameX || "Player X");
    setPlayerOName(playerNameO || "Player O");
    setState((prevState) => ({
      boardSize: size,
      clock: clock,
      time: time,
      matchID: prevState.matchID + 1,
    }));
  };

  return (
    <>
      <h1>Ultimate Tic Tac Toe</h1>
      <div className="app" style={{ marginTop: "20px" }}>
        <SettingsForm defaultValues={state} submitCallback={newGame} />
        <br />
        <Game
          key={state.matchID}
          size={state.boardSize}
          clock={state.clock}
          time={state.time}
          playerXName={playerXName}
          playerOName={playerOName}
          renderInfo={true}
        />
      </div>
    </>
  );
};

export default App;
