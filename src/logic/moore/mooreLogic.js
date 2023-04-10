/**
  @module mooreLogic
*/

import { MOORE } from "../../components/Minimizer";
import {
  getMinimizedPartitions,
  getNewStateEquivalences,
  removeInaccessibleStates,
} from "../logicUtils";

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

  return {
    machine: newMooreMachine,
    minimizedPartitions,
    removedStates,
  };
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
    type: MOORE,
  };
}

/**
 * Minimizes a Moore Machine using the equivalence partition method.
 * @param {Object} mooreMachine - An object representing a Moore Machine.
 * @returns {Array} - Returns an array with two elements: the new Moore Machine object and an array with the new partitions.
 */
function minimizeMooreMachine(mooreMachine) {
  const minimizedPartitions = getMinimizedPartitions(
    mooreMachine.states,
    getFirstDistinguishablePartition(mooreMachine.states)
  );
  const newMooreMachine = buildNewMooreMachine(
    mooreMachine,
    minimizedPartitions
  );
  return [newMooreMachine, minimizedPartitions];
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
    type: MOORE,
  };

  return newMooreMachine;
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
