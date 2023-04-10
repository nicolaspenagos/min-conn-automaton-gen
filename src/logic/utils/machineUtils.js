/**
  @module logicUtils
*/

/**
 * Returns an array of options, each with a label and value corresponding to each state in the input array.
 * @param {string[]} states - The array of states to convert to options.
 * @returns {object[]} An array of options, each containing a label and value.
 */
export function getStatesOptions(states) {
  const options = states.map((state) => {
    return { label: state, value: state };
  });
  return options;
}

/**
 * Generates an empty matrix with the specified dimensions and number of extra columns.
 * @param {number} iMax - The number of rows in the matrix.
 * @param {number} jMax - The number of columns in the matrix.
 * @param {number} extraCols - The number of extra columns to add to each row.
 * @returns {any[][]} An empty matrix with the specified dimensions.
 */
export function generateEmptyMatrix(iMax, jMax, extraCols) {
  let matrix = [];
  for (let i = 0; i < iMax; i++) {
    let row = Array(jMax + extraCols);
    row.fill(null, 0);
    matrix.push(row);
  }
  return matrix;
}

/**
 * Returns true if the input matrix is completely filled, false otherwise.
 * @param {any[][]} matrix - The matrix to check.
 * @returns {boolean} True if the matrix is completely filled, false otherwise.
 */
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

/**
 * Converts an array of sets into a string representation.
 * @param {Set[]} array - The array of sets to convert.
 * @returns {string} A string representation of the input array of sets.
 */
export function fromSetToString(array) {
  if (array.length === 0) return "";

  let str = "";
  for (let i = 0; i < array.length; i++) {
    let counter = 0;
    str += "{";
    array[i].forEach((e) => {
      str += e;
      if (counter + 1 < array[i].size) str += ",";
      counter++;
    });
    str += "}";
    if (i + 1 < array.length) {
      str += ",";
    }
  }
  return str;
}
