export function getMinMooreMachine(
  states,
  initialState,
  inputAlphabet,
  matrix
) {
  const mooreMachine = buildMooreMachine(
    states,
    initialState,
    inputAlphabet,
    matrix
  );
  const removedStates = removeInaccessibleStates(mooreMachine);
  const [newMooreMachine, minimizedPartitions] =
    minimizeMooreMachine(mooreMachine);

  const response = {
    newMooreMachine,
    minimizedPartitions,
    removedStates,
  };

  console.log(response);
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

  return {
    initialState,
    states: statesMap,
    inputAlphabet,
  };
}

function minimizeMooreMachine(mooreMachine) {
  const minimizedPartitions = getMinimizedPartitions(mooreMachine.states);
  const newMooreMachine = buildNewMooreMachine(
    mooreMachine,
    minimizedPartitions
  );
  return [newMooreMachine, minimizedPartitions];
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

function buildNewMooreMachine(prevMooreMachine, minimizedPartitions) {
  const newStateEquivalences = getNewStateEquivalences(
    minimizedPartitions[minimizedPartitions.length - 1]
  );
  const newStateMap = getNewStatesMap(
    prevMooreMachine.states,
    newStateEquivalences
  );

  const newMooreMachine = {
    initialState: newStateEquivalences.get(prevMooreMachine.initialState),
    inputAlphabet: prevMooreMachine.inputAlphabet,
    states: newStateMap,
  };

  return newMooreMachine;
}

function getNewStateEquivalences(lastPartition) {
  let newStatesMap = new Map();
  let key;

  for (let i = 0; i < lastPartition.length; i++) {
    let newStateKeysArray = [];
    for (key of lastPartition[i]) {
      newStateKeysArray.push(key);
    }
    let newStateKey = "{" + newStateKeysArray.join(",") + "}";

    newStateKeysArray.forEach((key) => {
      newStatesMap.set(key, newStateKey);
    });
  }
  return newStatesMap;
}

function getNewStatesMap(prevStates, newStateEquivalences) {
  let newStates = new Map();

  for (const [prevKey, prevVal] of prevStates) {
    const newKey = newStateEquivalences.get(prevKey);
    if (!newStates.has(newKey)) {
      let newStatesTransitions = [];
      prevVal.stateStransitions.forEach((prevStateTrans) => {
        newStatesTransitions.push(newStateEquivalences.get(prevStateTrans));
      });
      newStates.set(newKey, {
        output: prevVal.output,
        stateStransitions: newStatesTransitions,
      });
    }
  }

  return newStates;
}

function removeInaccessibleStates(mooreMachine) {
  const accessedStates = accessState(
    mooreMachine.initialState,
    new Set(),
    mooreMachine
  );

  if (accessedStates.size === mooreMachine.states.size) {
    return "No state was removed";
  }

  let inaccessibleStates = "[ ";

  let counter = 0;
  for (const [key, val] of mooreMachine.states) {
    counter++;
    if (!accessedStates.has(key)) {
      inaccessibleStates += key;
      mooreMachine.states.delete(key);
      if (counter + 1 < mooreMachine.states.size) inaccessibleStates += ",";
    }
  }
  inaccessibleStates += " ]";
  return inaccessibleStates;
}

function accessState(state, accessedStates, mooreMachine) {
  accessedStates.add(state);
  const currentTransition = mooreMachine.states.get(state).stateStransitions;
  for (let i = 0; i < currentTransition.length; i++) {
    if (!accessedStates.has(currentTransition[i]))
      accessState(currentTransition[i], accessedStates, mooreMachine);
  }

  return accessedStates;
}
