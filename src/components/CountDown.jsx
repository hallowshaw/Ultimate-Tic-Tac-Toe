import React, { useState, useEffect } from "react";

const CountDown = (props) => {
  const [elapsed, setElapsed] = useState(0);
  let lastTick = null;
  let timer = null;

  const tick = () => {
    setElapsed((prevElapsed) => {
      const now = new Date();
      const dt = now - lastTick;
      const newElapsed = prevElapsed + dt;
      const remaining = props.seconds - newElapsed / 1000;
      if (remaining < 0.15) {
        props.timeOverCallback(props.player);
      }
      return newElapsed;
    });
    lastTick = new Date();
  };

  const pause = () => {
    clearInterval(timer);
    timer = null;
    lastTick = null;
  };

  const resume = () => {
    timer = setInterval(tick, 1000);
    lastTick = new Date();
  };

  useEffect(() => {
    if (props.isPaused) {
      pause();
    } else if (!timer) {
      resume();
    }
    return () => {
      clearInterval(timer);
    };
  }, [props.isPaused]);

  const remaining = props.seconds - Math.floor(elapsed / 1000);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <p className="countdown">
      {("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}
    </p>
  );
};

export default CountDown;
