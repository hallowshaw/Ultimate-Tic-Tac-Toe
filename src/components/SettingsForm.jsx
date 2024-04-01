import React, { useState } from "react";

const SettingsForm = (props) => {
  const [state, setState] = useState({
    boardSize: props.defaultValues.boardSize,
    clock: props.defaultValues.clock,
    time: props.defaultValues.time,
  });

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    props.submitCallback(state.boardSize, state.clock, state.time);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input className="NewGame" type="submit" value="New game" />
      <label style={{ padding: "20px" }} className="settings-label boardLen">
        Board size{" "}
        <input
          className="input"
          name="boardSize"
          type="number"
          min="2"
          max="10"
          value={state.boardSize}
          onChange={handleChange}
        />
      </label>
      {/* <label
        style={{ padding: "20px" }}
        className="settings-label timer ClockBtn"
      >
        Clock{" "}
        <input
          name="clock"
          type="checkbox"
          checked={state.clock}
          onChange={handleChange}
        />
      </label> */}
      {state.clock && (
        <label className="settings-label">
          Time (min){" "}
          <input
            name="time"
            type="number"
            min="1"
            value={state.time}
            onChange={handleChange}
          />
        </label>
      )}
    </form>
  );
};

export default SettingsForm;
