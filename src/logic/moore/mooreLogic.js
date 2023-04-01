export function getMinMooreMachine(
  states,
  initialState,
  inputAlphabet,
  matrix
) {
  buildMooreMachine(states, initialState, inputAlphabet, matrix);
}

function buildMooreMachine(states, initialState, inputAlphabet, matrix) {
  let statesMap = new Map();

  for (let i = 0; i < states.length; i++) {
    let stateStransitions = [];
    for (let j = 0; j < inputAlphabet.length; j++) {
      stateStransitions.push(matrix[i][j]);
    }

    // The output of the current state is stored in the last j-index of the
    // matrix (each row-array stores the next state for each input and the
    // state's output in the final position).
    const output = matrix[i][inputAlphabet.length];
    statesMap.set(states[i], { stateStransitions, output });
  }

  const mooreMachine = {
    initialState,
    states: statesMap,
  };

  minimizeMooreMachine(mooreMachine);
}

function minimizeMooreMachine(mooreMachine) {
  const minimizedPartitions = getMinimizedPartitions(mooreMachine.states);
  console.log(minimizedPartitions);
}

function getMinimizedPartitions(states) {
  let partitionsResponse = [];
  let currentPartitionArray = getFirstDistinguishablePartition(states);
  let prevPartitionArray;

  do {
    prevPartitionArray = [...currentPartitionArray];
    partitionsResponse.push(prevPartitionArray);
    currentPartitionArray = [];

    for (const [state, values] of states) {
      let assignedFlag = false;

      for (let i = 0; i < currentPartitionArray.length && !assignedFlag; i++) {
        const stateStransitionsA = states.get(state).stateStransitions;
        const [partitionRepresentative] = currentPartitionArray[i];
        const stateStransitionsB = states.get(
          partitionRepresentative
        ).stateStransitions;

        if (
          doBelongToPartition(
            stateStransitionsA,
            stateStransitionsB,
            prevPartitionArray
          )
        ) {
          currentPartitionArray[i].add(state);
          assignedFlag = true;
        }
      }

      if (!assignedFlag) {
        const newPartitionSet = new Set();
        newPartitionSet.add(state);
        currentPartitionArray.push(newPartitionSet);
      }
    }
  } while (!arePartitionsEqual(currentPartitionArray, prevPartitionArray));

  return partitionsResponse;
}

// Two states are distinguishable if their outputs for any input are different
function getFirstDistinguishablePartition(states) {
  let firstPartition = [new Set(), new Set()];
  for (const [stateKey, value] of states.entries()) {
    if (value.output === "0") {
      firstPartition[0].add(stateKey);
    }
    if (value.output === "1") {
      firstPartition[1].add(stateKey);
    }
  }

  return firstPartition;
}

function doBelongToPartition(
  stateStransitionsA,
  stateStransitionsB,
  partitionsArray
) {
  for (let i = 0; i < stateStransitionsA.length; i++) {
    // A and B shared the same output since the states transitions are
    // sorted by output
    const A = stateStransitionsA[i];
    const B = stateStransitionsB[i];

    let belongFlag = false;
    let j = 0;
    while (j < partitionsArray.length && !belongFlag) {
      const currentPartition = partitionsArray[j];

      if (currentPartition.has(A) && currentPartition.has(B)) {
        belongFlag = true;
      }
      j++;
    }

    if (!belongFlag) {
      return false;
    }
  }

  return true;
}

function areSetsEqual(a, b) {
  return a.size === b.size && [...a].every((value) => b.has(value));
}

function arePartitionsEqual(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (!areSetsEqual(a[i], b[i])) {
      return false;
    }
  }
  return true;
}