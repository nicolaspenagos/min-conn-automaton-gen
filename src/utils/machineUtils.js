export function getStatesOptions(states){
    const options = states.map((state) => {
      return { label: state, value: state };
    });
    return options;
};

export function generateEmptyMatrix(iMax, jMax, extraCols){
  let matrix = [];
  for(let i=0; i<iMax; i++){
   let row = Array(jMax+extraCols);
   row.fill(null, 0);
   matrix.push(row);
  }
  return matrix;
}

export function isFullFilled(matrix){
  matrix.forEach(row => {
    row.forEach(cell => {
        if(!cell){
          return false;
        }
    });
  });
  return true;
}
