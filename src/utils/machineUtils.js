export function getStatesOptions(states) {
  const options = states.map((state) => {
    return { label: state, value: state };
  });
  return options;
}

export function generateEmptyMatrix(iMax, jMax, extraCols) {
  let matrix = [];
  for (let i = 0; i < iMax; i++) {
    let row = Array(jMax + extraCols);
    row.fill(null, 0);
    matrix.push(row);
  }
  return matrix;
}

export function isFullFilled(matrix) {
  if (!matrix || !matrix[0]) return false;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (!matrix[i][j]) {
        return false;
      }
    }
  }
  return true;
}