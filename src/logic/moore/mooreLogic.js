/**
  @module mooreLogic
*/

/**
 * Builds a minimized Moore Machine given its components.
 * @param {string[]} states - An array with the names of the states of the machine.
 * @param {string} initialState - The name of the initial state.
 * @param {string[]} inputAlphabet - An array with the input alphabet symbols.
 * @param {string[][]} matrix - A matrix representing the transition function and outputs of the states.
 * @returns {void} - Does not return a value.
 */
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

/**
 * Builds a Moore Machine object given its components.
 * @param {string[]} states - An array with the names of the states of the machine.
 * @param {string} initialState - The name of the initial state.
 * @param {string[]} inputAlphabet - An array with the input alphabet symbols.
 * @param {string[][]} matrix - A matrix representing the transition function and outputs of the states.
 * @returns {Object} - Returns an object representing the Moore Machine.
 */
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

/**
 * Minimizes a Moore Machine using the equivalence partition method.
 * @param {Object} mooreMachine - An object representing a Moore Machine.
 * @returns {Array} - Returns an array with two elements: the new Moore Machine object and an array with the new partitions.
 */
function minimizeMooreMachine(mooreMachine) {
  const minimizedPartitions = getMinimizedPartitions(mooreMachine.states);
  const newMooreMachine = buildNewMooreMachine(
    mooreMachine,
    minimizedPartitions
  );
  return [newMooreMachine, minimizedPartitions];
}

/**
 * Returns the partitions generated by applying the algorithm
 * to minimize the number of states in a Moore machine.
 *
 * @param {Map} states - The states of the Moore machine
 * @returns {Array} - The partitions generated by the algorithm
 */
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

/**
 * Returns the first distinguishable partition.
 *
 * @param {Map} states - The states of the Moore machine
 * @returns {Array} - The first distinguishable partition
 */
function getFirstDistinguishablePartition(states) {
  // Two states are distinguishable if their outputs for any input are different
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

/**
 * Returns whether two states belong to the same partition.
 *
 * @param {Array} stateStransitionsA - The transitions of the first state
 * @param {Array} stateStransitionsB - The transitions of the second state
 * @param {Array} partitionsArray - ThÍe partitions to compare
 * @returns {boolean} - Whether the states belong to the same partition
 */
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

/**
 * Checks whether two sets are equal.
 *
 * @param {Set} a - The first set to compare.
 * @param {Set} b - The second set to compare.
 * @returns {boolean} Whether the two sets are equal.
 */
function areSetsEqual(a, b) {
  return a.size === b.size && [...a].every((value) => b.has(value));
}

/**
 * Checks whether two arrays of sets are equal.
 *
 * @param {Array<Set>} a - The first array of sets to compare.
 * @param {Array<Set>} b - The second array of sets to compare.
 * @returns {boolean} Whether the two arrays of sets are equal.
 */
function arePartitionsEqual(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (!areSetsEqual(a[i], b[i])) {
      return false;
    }
  }
  return true;
}

/**
 * Builds a new Moore machine from the previous one and minimized partitions.
 *
 * @param {Object} prevMooreMachine - The previous Moore machine.
 * @param {Array<Array<Set>>} minimizedPartitions - The minimized partitions.
 * @returns {Object} The new Moore machine.
 */
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

/**
 * Gets the new state equivalences.
 *
 * @param {Array<Set>} lastPartition - The last partition.
 * @returns {Map} The new state equivalences.
 */
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

/**
 * Gets the new states map.
 *
 * @param {Map} prevStates - The previous states map.
 * @param {Map} newStateEquivalences - The new state equivalences.
 * @returns {Map} The new states map.
 */
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

/**
 * Removes any states in the Moore Machine that are not reachable from the initial state
 * @param {Object} mooreMachine - The Moore Machine to remove states from
 * @returns {string} - A string containing the inaccessible states that were removed, or "No state was removed" if no states were removed
 */
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

/**
 * Recursively finds all states that can be reached from the current state
 * @param {string} state - The current state to find reachable states from
 * @param {Set} accessedStates - A set of all states that have already been accessed
 * @param {Object} mooreMachine - The Moore Machine being searched
 * @returns {Set} - A set of all states that can be reached from the current state
 */
function accessState(state, accessedStates, mooreMachine) {
  accessedStates.add(state);
  const currentTransition = mooreMachine.states.get(state).stateStransitions;
  for (let i = 0; i < currentTransition.length; i++) {
    if (!accessedStates.has(currentTransition[i]))
      accessState(currentTransition[i], accessedStates, mooreMachine);
  }

  return accessedStates;
}
