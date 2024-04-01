import React from "react";

const generateGridNxN = (className, size, generatorFunction) => {
  const rows = [];
  for (let i = 0; i < size; i++) {
    const cols = [];
    for (let j = 0; j < size; j++) {
      cols.push(generatorFunction(i * size + j));
    }
    rows.push(
      <div className={`${className}-row`} key={i}>
        {cols}
      </div>
    );
  }
  return <div className={className}>{rows}</div>;
};

export default generateGridNxN;
