/**
  @module mealyLogic
*/

import { MEALY } from "../../components/Minimizer";
import {
  getMinimizedPartitions,
  getNewStateEquivalences,
  removeInaccessibleStates,
} from "../logicUtils";

/**
 * Builds a Mealy machine object from its component parts.
 *
 * @param {Array} states - An array of states.
 * @param {String} initialState - The initial state.
 * @param {Array} inputAlphabet - An array of input alphabet symbols.
 * @param {Array} matrix - The transition function matrix.
 * @returns {Object} The Mealy machine object.
 */
export function getMealyMachine(states, initialState, inputAlphabet, matrix) {
  const mealyMachine = buildMealyMachine(
    states,
    initialState,
    inputAlphabet,
    matrix
  );

  const removedStates = removeInaccessibleStates(mealyMachine);
  const [newMealyMachine, minimizedPartitions] =
    minimizeMealyMachine(mealyMachine);

  return {
    machine: newMealyMachine,
    minimizedPartitions,
    removedStates,
  };
}

/**
 * Builds the Mealy machine object.
 *
 * @param {Array} states - An array of states.
 * @param {String} initialState - The initial state.
 * @param {Array} inputAlphabet - An array of input alphabet symbols.
 * @param {Array} matrix - The transition function matrix.
 * @returns {Object} The Mealy machine object.
 */
function buildMealyMachine(states, initialState, inputAlphabet, matrix) {
  let statesMap = new Map();

  for (let i = 0; i < states.length; i++) {
    let stateStransitions = [];
    for (let j = 0; j < inputAlphabet.length; j++) {
      stateStransitions.push(matrix[i][j]);
    }
    statesMap.set(states[i], { stateStransitions });
  }

  return {
    initialState,
    states: statesMap,
    inputAlphabet,
    type: MEALY,
  };
}

/**
 * Minimizes a given Mealy machine.
 *
 * @param {Object} mealyMachine - The Mealy machine object.
 * @returns {Array} An array containing the new Mealy machine and the minimized partitions.
 */
function minimizeMealyMachine(mealyMachine) {
  const minimizedPartitions = getMinimizedPartitions(
    mealyMachine.states,
    getFirstDistinguishablePartition(mealyMachine.states)
  );

  const newMealyMachine = buildNewMealyMachine(
    mealyMachine,
    minimizedPartitions
  );
  return [newMealyMachine, minimizedPartitions];
}

/**
 * Gets the first distinguishable partition.
 *
 * @param {Map} states - The map of states.
 * @returns {Array} An array containing the partition.
 */
function getFirstDistinguishablePartition(states) {
  let firstPartitionMap = new Map();

  for (const [stateKey, value] of states.entries()) {
    let strOutputs = "";
    for (let i = 0; i < value.stateStransitions.length; i++) {
      strOutputs += value.stateStransitions[i].output;
    }
    if (firstPartitionMap.has(strOutputs)) {
      let currentSet = firstPartitionMap.get(strOutputs);
      currentSet.add(stateKey);
      firstPartitionMap.set(strOutputs, currentSet);
    } else {
      let newSet = new Set();
      newSet.add(stateKey);
      firstPartitionMap.set(strOutputs, newSet);
    }
  }

  return Array.from(firstPartitionMap.values());
}

/**
 *Builds a new Mealy machine based on the given minimized partitions.
 *@param {Object} prevMealyMachine - The previous Mealy machine.
 *@param {Array} minimizedPartitions - The minimized partitions.
 *@returns {Object} A new Mealy machine.
 */
function buildNewMealyMachine(prevMealyMachine, minimizedPartitions) {
  const newStateEquivalences = getNewStateEquivalences(
    minimizedPartitions[minimizedPartitions.length - 1]
  );

  const newStateMap = getNewStatesMap(
    prevMealyMachine.states,
    newStateEquivalences
  );

  const newMealyMachine = {
    initialState: newStateEquivalences.get(prevMealyMachine.initialState),
    inputAlphabet: prevMealyMachine.inputAlphabet,
    states: newStateMap,
    type: MEALY,
  };

  return newMealyMachine;
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
        newStatesTransitions.push({
          nextState: newStateEquivalences.get(prevStateTrans.nextState),
          output: prevStateTrans.output,
        });
      });
      newStates.set(newKey, {
        stateStransitions: newStatesTransitions,
      });
    }
  }

  return newStates;
}
