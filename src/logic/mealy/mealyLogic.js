/**
  @module mealyLogic
*/

import { MEALY } from "../../components/Minimizer";
import { getMinimizedPartitions, getNewStateEquivalences, removeInaccessibleStates } from "../logicUtils";

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
    machine:newMealyMachine,
    minimizedPartitions,
    removedStates,
  };
}

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
    type:MEALY
  };

  console.log(newMealyMachine);
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
            nextState:newStateEquivalences.get(prevStateTrans.nextState),
            output:prevStateTrans.output
          });
        });
        newStates.set(newKey, {
          stateStransitions: newStatesTransitions,
        });
      }
    }
  
    return newStates;
  }
  

